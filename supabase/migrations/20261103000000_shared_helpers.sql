-- Shared helpers used by RLS policies and the order/review functions.
-- Identical to the definitions in 20260930000000_store_supporting_tables.sql; safe to run repeatedly.
-- Requires public.profiles(id, role, status).

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = timezone('utc', now()); return new; end; $$;

create or replace function public.is_admin() returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'ADMIN' and status = 'ACTIVE');
$$;
