"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ApiError, apiRequest } from "@/lib/api-client";
import { createClient } from "@/lib/supabase/client";

type WishlistContextValue = {
  ids: ReadonlySet<string>;
  count: number;
  loading: boolean;
  isSignedIn: boolean;
  has: (bookId: string) => boolean;
  toggle: (book: { id: string; title: string }) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const pending = useRef(new Set<string>());
  const { addToast } = useToast();
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      setIds(new Set(await apiRequest<string[]>("/api/v1/wishlist", { cache: "no-store" })));
      setIsSignedIn(true);
    } catch {
      // 401 (signed out) or a transient error: treat as an empty wishlist.
      setIds(new Set());
      setIsSignedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // supabase-js emits INITIAL_SESSION on subscribe, so this covers first load as well as sign-in/out.
  useEffect(() => {
    const { data: { subscription } } = createClient().auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") void load();
    });
    return () => subscription.unsubscribe();
  }, [load]);

  const toggle = useCallback<WishlistContextValue["toggle"]>(async ({ id, title }) => {
    if (pending.current.has(id)) return;
    pending.current.add(id);
    const wasSaved = ids.has(id);

    const apply = (saved: boolean) =>
      setIds((prev) => {
        const next = new Set(prev);
        if (saved) next.add(id); else next.delete(id);
        return next;
      });

    apply(!wasSaved); // optimistic
    try {
      if (wasSaved) await apiRequest(`/api/v1/wishlist?book_id=${id}`, { method: "DELETE" });
      else await apiRequest("/api/v1/wishlist", { method: "POST", json: { book_id: id } });
      addToast("success", `${title} ${wasSaved ? "removed from" : "added to"} your wishlist.`);
    } catch (error) {
      apply(wasSaved); // roll back
      if (error instanceof ApiError && error.status === 401) {
        addToast("info", "Please log in to save books to your wishlist.");
        router.push("/login");
      } else {
        addToast("error", "Could not update your wishlist. Please try again.");
      }
    } finally {
      pending.current.delete(id);
    }
  }, [ids, addToast, router]);

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, count: ids.size, loading, isSignedIn, has: (id) => ids.has(id), toggle }),
    [ids, loading, isSignedIn, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
