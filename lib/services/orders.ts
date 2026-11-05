import type { createClient } from "@/lib/supabase/server";
import type { CustomerInput, OrderItemInput } from "@/lib/validation/checkout";
import { ServiceError } from "./errors";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export async function placeOrder(supabase: Supabase, customer: CustomerInput, items: OrderItemInput[]) {
  const { data, error } = await supabase.rpc("place_order", {
    p_customer: customer,
    p_items: items.map(({ id, quantity }) => ({ id, quantity })),
  });

  if (error) {
    // 22023 = invalid input, P0001 = business rule (e.g. book unavailable)
    const clientError = error.code === "22023" || error.code === "P0001";
    if (!clientError) console.error("place_order failed:", error.code, error.message, error.details ?? "");
    throw new ServiceError(clientError ? error.message : "Failed to create order", clientError ? 400 : 500);
  }
  return data;
}

export async function listOrders(supabase: Supabase, userId?: string) {
  let query = supabase
    .from("orders")
    .select("*, order_items(id, quantity, unit_price, book_id, books(id, title, author, image_url))")
    .order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) throw new ServiceError(error.message, 500);
  return data ?? [];
}
