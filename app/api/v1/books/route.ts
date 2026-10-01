import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { parseBody } from "@/lib/api";
import { toStoreBook } from "@/lib/book-shape";

const bookSchema = z.object({ title: z.string().min(1), author: z.string().min(1), description: z.string().nullable().optional(), price: z.coerce.number().nonnegative(), stock: z.boolean().default(true), image_url: z.string().nullable().optional(), category: z.string().nullable().optional() });

export async function GET(request: Request) {
  const url = new URL(request.url); const supabase = await createClient();
  let query = supabase.from("books").select("*").order("created_at", { ascending: false });
  const search = url.searchParams.get("search"); const category = url.searchParams.get("category");
  if (search) query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: (data ?? []).map((row) => ({ ...toStoreBook(row as Record<string, unknown>), image_url: row.image_url })) });
}

export async function POST(request: Request) {
  try { const { supabase } = await requireAdmin(); const parsed = await parseBody(request, bookSchema); if (parsed.response) return parsed.response; const { data, error } = await supabase.from("books").insert(parsed.data).select().single(); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ data }, { status: 201 }); }
  catch (error) { return authErrorResponse(error); }
}
