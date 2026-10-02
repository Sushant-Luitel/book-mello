import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBody } from "@/lib/api";
import { z } from "zod";

const checkoutSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().optional(),
  province: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  notes: z.string().optional(),
  paymentMethod: z.string(),
  items: z.array(z.object({
    id: z.string().uuid(),
    price: z.number().positive(),
    quantity: z.number().int().positive()
  })).min(1),
  subtotal: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  total: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const parsed = await parseBody(request, checkoutSchema);
    if (parsed.response) return parsed.response;
    const data = parsed.data;

    const orderNumber = `BM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const { data: order, error: orderError } = await supabase.from("orders").insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      subtotal: data.subtotal,
      shipping_fee: data.shipping,
      total_amount: data.total,
      shipping_address: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        province: data.province,
        city: data.city,
        address: data.address,
        notes: data.notes,
        paymentMethod: data.paymentMethod
      }
    }).select().single();

    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message ?? "Failed to create order" }, { status: 500 });
    }

    const orderItems = data.items.map(item => ({
      order_id: order.id,
      book_id: item.id,
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }
    
    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    }

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
