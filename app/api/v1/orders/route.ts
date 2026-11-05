import { NextResponse } from "next/server";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { handleRouteError } from "@/lib/api";
import { listOrders } from "@/lib/services/orders";

// GET /api/v1/orders            -> all orders (admin)
// GET /api/v1/orders?scope=mine -> the signed-in customer's orders (RLS-scoped)
export async function GET(request: Request) {
  try {
    const mine = new URL(request.url).searchParams.get("scope") === "mine";
    const { supabase, user } = mine ? await requireAuth() : await requireAdmin();
    return NextResponse.json({ data: await listOrders(supabase, mine ? user.id : undefined) });
  } catch (error) {
    return handleRouteError(error);
  }
}
