"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ApiError, apiRequest } from "@/lib/api-client";
import { useWishlist } from "@/lib/wishlist-context";
import type { Review, ReviewSummary } from "@/lib/services/reviews";

type ReviewsData = { summary: ReviewSummary; reviews: Review[]; can_review: boolean };

export function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${className} ${n <= Math.round(value) ? "fill-accent text-accent" : "fill-muted text-muted"}`} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="p-0.5 rounded focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star className={`h-7 w-7 transition-colors ${n <= shown ? "fill-accent text-accent" : "fill-muted text-muted-foreground/40"}`} />
        </button>
      ))}
    </div>
  );
}

export function BookReviews({ bookId, onSummaryChange }: { bookId: string; onSummaryChange?: (summary: ReviewSummary) => void }) {
  const { isSignedIn } = useWishlist(); // tracks Supabase auth state for the whole app
  const { addToast } = useToast();
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const apply = useCallback((next: ReviewsData) => {
    setData(next);
    onSummaryChange?.(next.summary);
  }, [onSummaryChange]);

  // Reload when the book changes or the user signs in/out (is_mine depends on the session).
  useEffect(() => {
    let active = true;
    apiRequest<ReviewsData>(`/api/v1/books/${bookId}/reviews`, { cache: "no-store" })
      .then((next) => { if (active) { setLoadError(false); apply(next); } })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, isSignedIn]);

  const mine = data?.reviews.find((r) => r.is_mine);
  const canReview = isSignedIn && (data?.can_review ?? false);
  const showForm = canReview && (!mine || editing);

  const startEdit = () => {
    if (!mine) return;
    setRating(mine.rating); setTitle(mine.title ?? ""); setContent(mine.content); setEditing(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (rating < 1) return addToast("error", "Please choose a star rating.");
    if (!content.trim()) return addToast("error", "Please write a few words about the book.");
    setSaving(true);
    try {
      apply(await apiRequest<ReviewsData>(`/api/v1/books/${bookId}/reviews`, { method: "POST", json: { rating, title: title.trim() || undefined, content } }));
      addToast("success", mine ? "Your review was updated." : "Thanks for your review!");
      setEditing(false); setRating(0); setTitle(""); setContent("");
    } catch (error) {
      addToast("error", error instanceof ApiError && error.status === 401 ? "Please log in to write a review." : error instanceof Error ? error.message : "Could not save your review.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete your review?")) return;
    try {
      apply(await apiRequest<ReviewsData>(`/api/v1/books/${bookId}/reviews`, { method: "DELETE" }));
      addToast("success", "Your review was deleted.");
    } catch {
      addToast("error", "Could not delete your review.");
    }
  };

  if (loadError) return <p className="text-sm text-muted-foreground">Reviews are unavailable right now. Please try again later.</p>;
  if (!data) return <div className="h-40 rounded-lg bg-muted animate-pulse max-w-4xl" aria-busy="true" />;

  const { summary, reviews } = data;

  return (
    <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="md:col-span-1 space-y-6">
        <div className="text-center md:text-left">
          <h3 className="text-4xl font-bold font-serif mb-2">{summary.count ? summary.average.toFixed(1) : "–"}</h3>
          <div className="flex justify-center md:justify-start mb-2"><Stars value={summary.average} className="h-5 w-5" /></div>
          <p className="text-muted-foreground text-sm">
            {summary.count ? `Based on ${summary.count} review${summary.count > 1 ? "s" : ""}` : "No reviews yet"}
          </p>
        </div>

        <div className="space-y-2">
          {([5, 4, 3, 2, 1] as const).map((n) => {
            const count = summary.distribution[String(n) as "1"] ?? 0;
            const pct = summary.count ? (count / summary.count) * 100 : 0;
            return (
              <div key={n} className="flex items-center text-sm">
                <span className="w-12 shrink-0">{n} Stars</span>
                <div className="flex-1 mx-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-6 text-right text-muted-foreground tabular-nums">{count}</span>
              </div>
            );
          })}
        </div>

        {!isSignedIn && (
          <Button asChild variant="outline" className="w-full"><Link href="/login">Log in to write a review</Link></Button>
        )}
        {isSignedIn && !canReview && !mine && (
          <p className="text-sm text-muted-foreground text-center">Only customers who purchased this book can review it.</p>
        )}
        {isSignedIn && mine && !editing && (
          <Button variant="outline" className="w-full" onClick={startEdit}>Edit your review</Button>
        )}
      </div>

      <div className="md:col-span-2 space-y-8">
        {showForm && (
          <form onSubmit={submit} className="rounded-xl border border-border p-5 space-y-4 bg-card">
            <h4 className="font-serif font-semibold text-lg">{mine ? "Edit your review" : "Write a review"}</h4>
            <StarPicker value={rating} onChange={setRating} />
            <Input placeholder="Headline (optional)" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} aria-label="Review headline" />
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                rows={4}
                placeholder="What did you think of this book?"
                aria-label="Review"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 resize-y"
              />
              <p className="text-xs text-muted-foreground text-right">{content.length}/2000</p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="rounded-full">{saving ? "Saving…" : mine ? "Update review" : "Submit review"}</Button>
              {editing && <Button type="button" variant="ghost" className="rounded-full" onClick={() => setEditing(false)}>Cancel</Button>}
            </div>
          </form>
        )}

        {reviews.length === 0 && !showForm && (
          <p className="text-muted-foreground text-sm">Be the first to share what you thought about this book.</p>
        )}

        {reviews.map((review) => (
          <article key={review.id} className="border-b border-border pb-8 last:border-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {review.reviewer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm flex items-center gap-2 flex-wrap">
                    {review.is_mine ? "You" : review.reviewer_name}
                    {review.verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                      </span>
                    )}
                  </p>
                  <div className="mt-0.5"><Stars value={review.rating} className="h-3 w-3" /></div>
                </div>
              </div>
              <time className="text-xs text-muted-foreground" dateTime={review.created_at}>
                {new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </time>
            </div>
            {review.title && <h4 className="font-semibold text-sm mb-2">{review.title}</h4>}
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{review.content}</p>
            {review.is_mine && !editing && (
              <div className="flex gap-4 text-xs font-medium text-muted-foreground mt-3">
                <button className="hover:text-foreground transition-colors" onClick={startEdit}>Edit</button>
                <button className="hover:text-destructive transition-colors" onClick={remove}>Delete</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
