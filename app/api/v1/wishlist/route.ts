import { NextResponse } from "next/server";
import { requireAuth, authErrorResponse } from "@/lib/auth";
import { parseBody } from "@/lib/api";
import { z } from "zod";

const bookmarkSchema = z.object({
  book_id: z.string().uuid(),
});

// Get user's bookmarked items
export async function GET() {
  try {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("book_id")
      .eq("user_id", user.id);
      
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data.map(item => item.book_id) });
  } catch (error) {
    return authErrorResponse(error);
  }
}

// Add a bookmark
export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireAuth();
    const parsed = await parseBody(request, bookmarkSchema);
    if (parsed.response) return parsed.response;
    
    const { error } = await supabase
      .from("wishlist_items")
      .upsert(
        { user_id: user.id, book_id: parsed.data.book_id },
        { onConflict: "user_id,book_id" }
      );
      
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}

// Remove a bookmark
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const book_id = searchParams.get("book_id");
    
    if (!book_id) return NextResponse.json({ error: "Missing book_id" }, { status: 400 });
    
    const { supabase, user } = await requireAuth();
    
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", user.id)
      .eq("book_id", book_id);
      
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
