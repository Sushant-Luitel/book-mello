-- Reviews & ratings read-side. Writes go straight to public.reviews through the existing owner RLS policies
-- (insert/update/delete own row; unique(book_id, user_id) = one review per customer per book).

-- Ensure the reviews table exists (identical to the definition in 20260930000000_store_supporting_tables.sql,
-- so this is a no-op where that migration was already applied). Requires public.books, and the
-- public.set_updated_at() / public.is_admin() helpers from that migration.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title varchar(200),
  content text not null,
  helpful_count integer not null default 0 check (helpful_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (book_id, user_id)
);
create index if not exists reviews_book_id_idx on public.reviews(book_id);
alter table public.reviews enable row level security;

drop trigger if exists reviews_updated_at on public.reviews;
create trigger reviews_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();

-- Only customers who bought the book (any non-cancelled order) may review it.
-- security definer so the check does not depend on RLS of orders/order_items for the caller.
create or replace function public.has_purchased_book(p_book_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and exists (
    select 1 from public.orders o join public.order_items oi on oi.order_id = o.id
    where o.user_id = auth.uid() and oi.book_id = p_book_id and o.fulfillment_status <> 'CANCELLED'
  );
$$;
revoke all on function public.has_purchased_book(uuid) from public;
grant execute on function public.has_purchased_book(uuid) to anon, authenticated;

drop policy if exists reviews_public on public.reviews;
drop policy if exists reviews_owner on public.reviews;
drop policy if exists reviews_manage on public.reviews;
drop policy if exists reviews_delete on public.reviews;
create policy reviews_public on public.reviews for select using (true);
create policy reviews_owner on public.reviews for insert
  with check (user_id = auth.uid() and public.has_purchased_book(book_id));
create policy reviews_manage on public.reviews for update
  using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy reviews_delete on public.reviews for delete using (user_id = auth.uid() or public.is_admin());

-- Cheap content guard so oversized text can't be stored even if the API is bypassed.
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'reviews_content_length') then
    alter table public.reviews add constraint reviews_content_length
      check (char_length(content) between 1 and 2000 and (title is null or char_length(title) <= 200));
  end if;
end $$;

create index if not exists reviews_book_created_idx on public.reviews(book_id, created_at desc);

-- Aggregate stats per book. Owned by the migration role (not security_invoker) so anon visitors can read
-- averages without being able to read other review columns.
create or replace view public.book_rating_stats as
  select book_id, round(avg(rating)::numeric, 1)::float8 as avg_rating, count(*)::int as review_count
  from public.reviews group by book_id;
grant select on public.book_rating_stats to anon, authenticated;

-- Reviews with a public display name ("Aarav K.") and a verified-purchase flag.
-- profiles RLS hides other users' rows, hence security definer; only the display name leaves the function.
create or replace function public.list_book_reviews(p_book_id uuid, p_limit int default 20, p_offset int default 0)
returns table (
  id uuid, rating int, title text, content text, created_at timestamptz, updated_at timestamptz,
  reviewer_name text, is_mine boolean, verified_purchase boolean
)
language sql stable security definer set search_path = public as $$
  select r.id, r.rating, r.title::text, r.content, r.created_at, r.updated_at,
    coalesce(
      nullif(trim(split_part(p.full_name, ' ', 1) ||
        case when position(' ' in trim(p.full_name)) > 0
             then ' ' || left(split_part(trim(p.full_name), ' ', 2), 1) || '.' else '' end), ''),
      'Reader') as reviewer_name,
    (r.user_id = auth.uid()) as is_mine,
    exists (
      select 1 from public.orders o join public.order_items oi on oi.order_id = o.id
      where o.user_id = r.user_id and oi.book_id = r.book_id and o.fulfillment_status <> 'CANCELLED'
    ) as verified_purchase
  from public.reviews r
  left join public.profiles p on p.id = r.user_id
  where r.book_id = p_book_id
  order by (r.user_id = auth.uid()) desc, r.created_at desc
  limit least(greatest(p_limit, 1), 50) offset greatest(p_offset, 0);
$$;

create or replace function public.book_review_summary(p_book_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'average', coalesce(round(avg(rating)::numeric, 1), 0),
    'count', count(*),
    'distribution', jsonb_build_object(
      '1', count(*) filter (where rating = 1), '2', count(*) filter (where rating = 2),
      '3', count(*) filter (where rating = 3), '4', count(*) filter (where rating = 4),
      '5', count(*) filter (where rating = 5)))
  from public.reviews where book_id = p_book_id;
$$;

revoke all on function public.list_book_reviews(uuid, int, int) from public;
revoke all on function public.book_review_summary(uuid) from public;
grant execute on function public.list_book_reviews(uuid, int, int) to anon, authenticated;
grant execute on function public.book_review_summary(uuid) to anon, authenticated;
