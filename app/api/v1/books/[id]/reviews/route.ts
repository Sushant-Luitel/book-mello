import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { parseBody, handleRouteError } from "@/lib/api";
import { reviewSchema } from "@/lib/validation/reviews";
import { deleteReview, getBookReviews, saveReview } from "@/lib/services/reviews";
import { ServiceError } from "@/lib/services/errors";

type Ctx = { params: Promise<{ id: string }> };

async function bookIdFrom(ctx: Ctx) {
  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) throw new ServiceError("Invalid book id", 400);
  return id;
}

// Public: summary + reviews (is_mine is set when the caller is signed in).
export async function GET(request: Request, ctx: Ctx) {
  try {
    const bookId = await bookIdFrom(ctx);
    const params = new URL(request.url).searchParams;
    const limit = Math.min(Math.max(Number(params.get("limit")) || 20, 1), 50);
    const offset = Math.max(Number(params.get("offset")) || 0, 0);
    return NextResponse.json({ data: await getBookReviews(await createClient(), bookId, limit, offset) });
  } catch (error) {
    return handleRouteError(error);
  }
}

// Create or update the signed-in customer's review.
export async function POST(request: Request, ctx: Ctx) {
  try {
    const bookId = await bookIdFrom(ctx);
    const { supabase, user } = await requireAuth();
    const parsed = await parseBody(request, reviewSchema);
    if (parsed.response) return parsed.response;
    await saveReview(supabase, user.id, bookId, parsed.data);
    return NextResponse.json({ data: await getBookReviews(supabase, bookId) }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

// Delete the signed-in customer's own review.
export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const bookId = await bookIdFrom(ctx);
    const { supabase, user } = await requireAuth();
    await deleteReview(supabase, user.id, bookId);
    return NextResponse.json({ data: await getBookReviews(supabase, bookId) });
  } catch (error) {
    return handleRouteError(error);
  }
}
