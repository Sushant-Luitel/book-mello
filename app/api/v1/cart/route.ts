import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, authErrorResponse } from "@/lib/auth";
import { parseBody } from "@/lib/api";

const itemSchema = z.object({ book_id: z.string().min(1), quantity: z.number().int().positive().max(99) });
export async function GET() { try { const { supabase, user } = await requireAuth(); const { data, error } = await supabase.from("cart_items").select("*, books(*)").eq("user_id", user.id); if (error) return NextResponse.json({ error: error.message }, { status: 500 }); return NextResponse.json({ data }); } catch (error) { return authErrorResponse(error); } }
export async function POST(request: Request) { try { const { supabase, user } = await requireAuth(); const parsed = await parseBody(request, itemSchema); if (parsed.response) return parsed.response; const { data, error } = await supabase.from("cart_items").upsert({ ...parsed.data, user_id: user.id }, { onConflict: "user_id,book_id" }).select().single(); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ data }, { status: 201 }); } catch (error) { return authErrorResponse(error); } }
