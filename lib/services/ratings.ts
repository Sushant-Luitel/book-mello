import type { createClient } from "@/lib/supabase/server";
import type { RatingStats, StoreBook } from "@/lib/book-shape";

type Supabase = Awaited<ReturnType<typeof createClient>>;

// One row per reviewed book, so fetching the whole view stays small and avoids huge `in (...)` URLs.
export async function getRatingStats(supabase: Supabase): Promise<Map<string, RatingStats>> {
  const { data, error } = await supabase.from("book_rating_stats").select("book_id, avg_rating, review_count");
  if (error) {
    console.error("Unable to load rating stats", error);
    return new Map();
  }
  return new Map((data ?? []).map((row) => [row.book_id as string, { avg_rating: Number(row.avg_rating), review_count: Number(row.review_count) }]));
}

export async function attachRatings<T extends StoreBook>(supabase: Supabase, books: T[]): Promise<T[]> {
  if (!books.length) return books;
  const stats = await getRatingStats(supabase);
  return books.map((book) => {
    const s = stats.get(book.id);
    return s ? { ...book, rating: s.avg_rating, reviews: s.review_count } : book;
  });
}
