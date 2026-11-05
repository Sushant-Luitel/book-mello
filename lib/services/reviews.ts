import type { createClient } from "@/lib/supabase/server";
import type { ReviewInput } from "@/lib/validation/reviews";
import { ServiceError } from "./errors";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type ReviewsPayload = { summary: ReviewSummary; reviews: Review[]; can_review: boolean };
export type ReviewSummary = { average: number; count: number; distribution: Record<"1" | "2" | "3" | "4" | "5", number> };
export type Review = {
  id: string; rating: number; title: string | null; content: string; created_at: string; updated_at: string;
  reviewer_name: string; is_mine: boolean; verified_purchase: boolean;
};

export async function getBookReviews(supabase: Supabase, bookId: string, limit = 20, offset = 0) {
  const [summary, reviews, canReview] = await Promise.all([
    supabase.rpc("book_review_summary", { p_book_id: bookId }),
    supabase.rpc("list_book_reviews", { p_book_id: bookId, p_limit: limit, p_offset: offset }),
    supabase.rpc("has_purchased_book", { p_book_id: bookId }),
  ]);
  if (summary.error || reviews.error) throw new ServiceError("Unable to load reviews", 500);
  return {
    summary: summary.data as ReviewSummary,
    reviews: (reviews.data ?? []) as Review[],
    can_review: canReview.data === true,
  } satisfies ReviewsPayload;
}

// Upsert: a customer has at most one review per book (unique(book_id, user_id)); posting again edits it.
// RLS (reviews_owner / reviews_manage) guarantees user_id = auth.uid().
export async function saveReview(supabase: Supabase, userId: string, bookId: string, input: ReviewInput) {
  const { data: book } = await supabase.from("books").select("id").eq("id", bookId).maybeSingle();
  if (!book) throw new ServiceError("Book not found", 404);

  const { data: purchased } = await supabase.rpc("has_purchased_book", { p_book_id: bookId });
  if (purchased !== true) throw new ServiceError("Only customers who bought this book can review it", 403);

  const { error } = await supabase.from("reviews").upsert(
    { book_id: bookId, user_id: userId, rating: input.rating, title: input.title || null, content: input.content },
    { onConflict: "book_id,user_id" },
  );
  if (error) throw new ServiceError("Unable to save your review", error.code === "42501" ? 403 : error.code === "23514" ? 400 : 500);
}

export async function deleteReview(supabase: Supabase, userId: string, bookId: string) {
  const { error } = await supabase.from("reviews").delete().eq("book_id", bookId).eq("user_id", userId);
  if (error) throw new ServiceError("Unable to delete your review", 500);
}
