import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBody, handleRouteError } from "@/lib/api";
import { checkoutSchema } from "@/lib/validation/checkout";
import { placeOrder } from "@/lib/services/orders";

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, checkoutSchema);
    if (parsed.response) return parsed.response;
    const { items, ...customer } = parsed.data;

    const data = await placeOrder(await createClient(), customer, items);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
