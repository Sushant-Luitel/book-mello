-- Checkout and order lifecycle as transactional Postgres functions.
-- Prices, availability and shipping are computed in the database; the client only sends book ids and quantities.
-- Assumes public.books(id uuid, price numeric, stock boolean) as used by the app.

create sequence if not exists public.order_number_seq;

create or replace function public.place_order(
  p_customer jsonb,
  p_items jsonb
) returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  c_free_shipping_threshold constant numeric := 2500;
  c_shipping_fee            constant numeric := 120;
  v_uid       uuid := auth.uid();
  v_payment   text := coalesce(p_customer->>'paymentMethod', 'cod');
  v_subtotal  numeric(10,2);
  v_shipping  numeric(10,2);
  v_missing   int;
  v_order     public.orders;
begin
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty' using errcode = '22023';
  end if;
  if v_payment not in ('cod', 'qr') then
    raise exception 'Unsupported payment method' using errcode = '22023';
  end if;

  -- Normalise requested lines (merge duplicate ids).
  drop table if exists _lines;
  create temp table _lines on commit drop as
    select (e->>'id')::uuid as book_id, sum((e->>'quantity')::int)::int as quantity
    from jsonb_array_elements(p_items) e
    group by 1;

  if exists (select 1 from _lines where quantity < 1 or quantity > 99) then
    raise exception 'Invalid quantity' using errcode = '22023';
  end if;

  -- Lock the books so price/availability cannot change mid-transaction.
  perform 1 from public.books b join _lines l on l.book_id = b.id for share of b;

  select count(*) into v_missing
  from _lines l
  left join public.books b on b.id = l.book_id
  where b.id is null or b.stock is not true;
  if v_missing > 0 then
    raise exception 'One or more books are unavailable' using errcode = 'P0001';
  end if;

  select sum(b.price * l.quantity) into v_subtotal
  from _lines l join public.books b on b.id = l.book_id;

  v_shipping := case when v_subtotal >= c_free_shipping_threshold then 0 else c_shipping_fee end;

  insert into public.orders (order_number, user_id, subtotal, shipping_fee, total_amount, shipping_address)
  values (
    'BM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 5, '0'),
    v_uid, v_subtotal, v_shipping, v_subtotal + v_shipping,
    jsonb_build_object(
      'fullName', p_customer->>'fullName', 'phone', p_customer->>'phone', 'email', p_customer->>'email',
      'province', p_customer->>'province', 'city', p_customer->>'city', 'address', p_customer->>'address',
      'notes', p_customer->>'notes', 'paymentMethod', v_payment))
  returning * into v_order;

  insert into public.order_items (order_id, book_id, quantity, unit_price)
  select v_order.id, l.book_id, l.quantity, b.price
  from _lines l join public.books b on b.id = l.book_id;

  insert into public.order_events (order_id, event_type, description, created_by)
  values (v_order.id, 'ORDER_PLACED', 'Order placed by customer', v_uid);

  if v_uid is not null then
    delete from public.cart_items where user_id = v_uid;
  end if;

  return v_order;
end;
$$;

create or replace function public.update_order_status(
  p_order_id uuid,
  p_fulfillment_status text default null,
  p_payment_status text default null
) returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_from  text;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Order not found' using errcode = 'P0002';
  end if;
  v_from := v_order.fulfillment_status;

  if p_fulfillment_status is not null and p_fulfillment_status <> v_from then
    if not (
      (v_from = 'PENDING'    and p_fulfillment_status in ('PROCESSING', 'CANCELLED')) or
      (v_from = 'PROCESSING' and p_fulfillment_status in ('SHIPPED', 'CANCELLED')) or
      (v_from = 'SHIPPED'    and p_fulfillment_status = 'DELIVERED')
    ) then
      raise exception 'Invalid status transition % -> %', v_from, p_fulfillment_status using errcode = '22023';
    end if;
    update public.orders set fulfillment_status = p_fulfillment_status where id = p_order_id;
    insert into public.order_events (order_id, event_type, description, metadata, created_by)
    values (p_order_id, 'FULFILLMENT_STATUS_CHANGED', v_from || ' -> ' || p_fulfillment_status,
            jsonb_build_object('from', v_from, 'to', p_fulfillment_status), auth.uid());
  end if;

  if p_payment_status is not null and p_payment_status <> v_order.payment_status then
    update public.orders set payment_status = p_payment_status where id = p_order_id;
    insert into public.order_events (order_id, event_type, description, metadata, created_by)
    values (p_order_id, 'PAYMENT_STATUS_CHANGED', v_order.payment_status || ' -> ' || p_payment_status,
            jsonb_build_object('from', v_order.payment_status, 'to', p_payment_status), auth.uid());
  end if;

  select * into v_order from public.orders where id = p_order_id;
  return v_order;
end;
$$;

revoke all on function public.place_order(jsonb, jsonb) from public;
revoke all on function public.update_order_status(uuid, text, text) from public;
grant execute on function public.place_order(jsonb, jsonb) to anon, authenticated;
grant execute on function public.update_order_status(uuid, text, text) to authenticated;

-- Direct writes to order tables are no longer needed by customers; place_order is the only entry point.
-- (Existing admin-only RLS policies on orders/order_items/order_events remain unchanged.)
