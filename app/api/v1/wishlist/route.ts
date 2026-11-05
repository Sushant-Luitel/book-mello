import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { parseBody, handleRouteError } from "@/lib/api";
import { toStoreBook } from "@/lib/book-shape";
import { attachRatings } from "@/lib/services/ratings";

const bookmarkSchema = z.object({ book_id: z.string().uuid() });

// GET /api/v1/wishlist               -> saved book ids
// GET /api/v1/wishlist?include=books -> saved books (newest first) as StoreBook[]
export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireAuth();

    if (new URL(request.url).searchParams.get("include") === "books") {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("created_at, books(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const rows = (data ?? []) as unknown as { books: Record<string, unknown> | null }[];
      const books = rows.flatMap((row) => (row.books ? [toStoreBook(row.books)] : []));
      return NextResponse.json({ data: await attachRatings(supabase, books) });
    }

    const { data, error } = await supabase.from("wishlist_items").select("book_id").eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data.map((item) => item.book_id) });
  } catch (error) {
    return handleRouteError(error);
  }
}

// Add a book to the wishlist (idempotent).
export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireAuth();
    const parsed = await parseBody(request, bookmarkSchema);
    if (parsed.response) return parsed.response;

    const { error } = await supabase
      .from("wishlist_items")
      .upsert({ user_id: user.id, book_id: parsed.data.book_id }, { onConflict: "user_id,book_id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

// Remove a book: DELETE /api/v1/wishlist?book_id=<uuid>
export async function DELETE(request: Request) {
  try {
    const bookId = new URL(request.url).searchParams.get("book_id");
    if (!z.string().uuid().safeParse(bookId).success) {
      return NextResponse.json({ error: "Missing or invalid book_id" }, { status: 400 });
    }
    const { supabase, user } = await requireAuth();
    const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("book_id", bookId!);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
