import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toStoreBook } from "@/lib/book-shape";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { parseBody } from "@/lib/api";

const updateSchema = z.object({ title: z.string().min(1).optional(), author: z.string().min(1).optional(), description: z.string().nullable().optional(), price: z.coerce.number().nonnegative().optional(), stock: z.boolean().optional(), image_url: z.string().url().nullable().optional(), category: z.string().nullable().optional() }).strict();

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("books").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Book not found" }, { status: 404 });
  return NextResponse.json({ data: toStoreBook(data as Record<string, unknown>) });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { supabase } = await requireAdmin();
    const parsed = await parseBody(request, updateSchema);
    if (parsed.response) return parsed.response;
    const { data, error } = await supabase.from("books").update(parsed.data).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: toStoreBook(data as Record<string, unknown>) });
  } catch (error) { return authErrorResponse(error); }
}
