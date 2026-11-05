import { createClient } from "@/lib/supabase/server";
import { toStoreBook } from "@/lib/book-shape";
import { attachRatings } from "@/lib/services/ratings";
export async function getBooks() { const supabase = await createClient(); const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false }); if (error) { console.error("Unable to load books", error); return []; } return attachRatings(supabase, (data ?? []).map((row) => toStoreBook(row as Record<string, unknown>))); }
export async function getBook(id: string) { const supabase = await createClient(); const { data, error } = await supabase.from("books").select("*").eq("id", id).maybeSingle(); if (error || !data) return null; const [book] = await attachRatings(supabase, [toStoreBook(data as Record<string, unknown>)]); return book; }
