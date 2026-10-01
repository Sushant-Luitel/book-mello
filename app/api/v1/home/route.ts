import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET() { const supabase = await createClient(); const [books, categories] = await Promise.all([supabase.from("books").select("*").eq("featured", true).limit(12), supabase.from("categories").select("*").eq("status", "ACTIVE").order("name")]); if (books.error || categories.error) return NextResponse.json({ error: "Unable to load home data" }, { status: 500 }); return NextResponse.json({ data: { featuredBooks: books.data, categories: categories.data } }); }
