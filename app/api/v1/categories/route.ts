import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const allCategories = new Set<string>();
    
    // Try to get from categories table (if it exists)
    const { data: dbCategories, error: catError } = await supabase.from("categories").select("name");
    if (!catError && dbCategories) {
      dbCategories.forEach(c => allCategories.add(c.name));
    }
    
    // Merge with books table categories to ensure backward compatibility
    const { data: books } = await supabase.from("books").select("category");
    if (books) {
      books.forEach(b => { if (b.category) allCategories.add(b.category); });
    }
    
    return NextResponse.json({ data: Array.from(allCategories).sort() });
  } catch (error) { 
    return NextResponse.json({ data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    
    const { error } = await supabase.from("categories").insert({ name: body.name.trim() });
    
    if (error) {
      // Return a helpful message if the table doesn't exist
      if (error.code === '42P01') {
         return NextResponse.json({ error: "The 'categories' table does not exist in the database. Please run the SQL command provided to create it." }, { status: 500 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
