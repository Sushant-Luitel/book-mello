import { NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase.from("orders").select("*, order_items(id, quantity)").order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data ?? [] });
  } catch (error) { return authErrorResponse(error); }
}
