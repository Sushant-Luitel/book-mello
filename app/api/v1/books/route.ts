import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { parseBody } from "@/lib/api";
import { toStoreBook } from "@/lib/book-shape";

const bookSchema = z.object({ title: z.string().min(1), author: z.string().min(1), description: z.string().nullable().optional(), price: z.coerce.number().nonnegative(), stock: z.boolean().default(true), image_url: z.string().nullable().optional(), category: z.string().nullable().optional() });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = z.object({ search: z.string().trim().max(100).optional(), category: z.string().trim().max(100).optional(), minPrice: z.coerce.number().nonnegative().optional(), maxPrice: z.coerce.number().nonnegative().optional(), available: z.enum(["true", "false"]).optional(), sort: z.enum(["relevance", "price_asc", "price_desc", "newest"]).default("newest"), page: z.coerce.number().int().positive().default(1), pageSize: z.coerce.number().int().min(1).max(48).default(12) }).safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid filters", details: parsed.error.flatten() }, { status: 400 });
  const filters = parsed.data;
  const supabase = await createClient();
  let query = supabase.from("books").select("*", { count: "exact" });
  const safeSearch = filters.search?.replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
  if (safeSearch) query = query.or(`title.ilike.%${safeSearch}%,author.ilike.%${safeSearch}%`);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.available !== undefined) query = query.eq("stock", filters.available === "true");
  if (filters.sort === "price_asc") query = query.order("price", { ascending: true });
  else if (filters.sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });
  const from = (filters.page - 1) * filters.pageSize;
  const [{ data, error, count }, categoryResult] = await Promise.all([
    query.range(from, from + filters.pageSize - 1),
    supabase.from("books").select("category").not("category", "is", null),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const total = count ?? 0;
  const categories = [...new Set((categoryResult.data ?? []).map((row) => row.category).filter(Boolean))].sort();
  return NextResponse.json({ data: (data ?? []).map((row) => ({ ...toStoreBook(row as Record<string, unknown>), image_url: row.image_url })), pagination: { page: filters.page, pageSize: filters.pageSize, total, totalPages: Math.max(1, Math.ceil(total / filters.pageSize)) }, facets: { categories } });
}

export async function POST(request: Request) {
  try { const { supabase } = await requireAdmin(); const parsed = await parseBody(request, bookSchema); if (parsed.response) return parsed.response; const { data, error } = await supabase.from("books").insert(parsed.data).select().single(); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ data }, { status: 201 }); }
  catch (error) { return authErrorResponse(error); }
}
