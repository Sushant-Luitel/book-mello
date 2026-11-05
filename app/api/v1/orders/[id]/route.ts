import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { parseBody } from "@/lib/api";

const updateSchema = z
  .object({
    fulfillment_status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
    payment_status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
  })
  .refine((v) => v.fulfillment_status || v.payment_status, { message: "Nothing to update" });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { supabase } = await requireAdmin();
    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }
    const parsed = await parseBody(request, updateSchema);
    if (parsed.response) return parsed.response;

    const { data, error } = await supabase.rpc("update_order_status", {
      p_order_id: id,
      p_fulfillment_status: parsed.data.fulfillment_status ?? null,
      p_payment_status: parsed.data.payment_status ?? null,
    });
    if (error) {
      const status = error.code === "P0002" ? 404 : error.code === "22023" ? 400 : error.code === "42501" ? 403 : 500;
      return NextResponse.json({ error: status === 500 ? "Failed to update order" : error.message }, { status });
    }
    return NextResponse.json({ data });
  } catch (error) {
    return authErrorResponse(error);
  }
}
