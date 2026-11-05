"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api-client";
import type { StoreBook } from "@/lib/book-shape";
import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistPage() {
  const { has, count } = useWishlist();
  const [books, setBooks] = useState<StoreBook[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "signed-out" | "error">("loading");

  useEffect(() => {
    let active = true;
    apiRequest<StoreBook[]>("/api/v1/wishlist?include=books", { cache: "no-store" })
      .then((data) => { if (active) { setBooks(data); setState("ready"); } })
      .catch((error) => { if (active) setState(error instanceof ApiError && error.status === 401 ? "signed-out" : "error"); });
    return () => { active = false; };
  }, []);

  // Removing a heart on this page drops the card immediately (shared wishlist state).
  const visible = (books ?? []).filter((book) => has(book.id));

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-[60vh] bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif">My Wishlist</h1>
            {state === "ready" && <p className="text-muted-foreground text-sm mt-1">{count} saved {count === 1 ? "book" : "books"}</p>}
          </div>

          {state === "loading" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-3/4 rounded-lg bg-muted animate-pulse" />)}
            </div>
          )}

          {state === "signed-out" && (
            <EmptyState title="Log in to see your wishlist" body="Save books you love and find them here on any device.">
              <Button asChild className="rounded-full"><Link href="/login">Log in</Link></Button>
            </EmptyState>
          )}

          {state === "error" && (
            <EmptyState title="Couldn't load your wishlist" body="Please refresh the page and try again." />
          )}

          {state === "ready" && visible.length === 0 && (
            <EmptyState title="Your wishlist is empty" body="Tap the heart on any book to save it for later.">
              <Button asChild className="rounded-full"><Link href="/all">Browse books</Link></Button>
            </EmptyState>
          )}

          {state === "ready" && visible.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {visible.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function EmptyState({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-20">
      <div className="h-14 w-14 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center"><Heart className="h-6 w-6" /></div>
      <h2 className="text-xl font-serif font-semibold">{title}</h2>
      <p className="text-muted-foreground text-sm max-w-sm">{body}</p>
      {children}
    </div>
  );
}
