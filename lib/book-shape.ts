/** Exact public.books row shape from Supabase. */
export type DatabaseBook = {
  id: string; title: string; author: string; description: string | null;
  price: number | string; stock: boolean; image_url: string | null;
  created_at: string; updated_at: string; category: string | null;
};

/** View model expected by the existing bookstore UI. */
export type StoreBook = {
  id: string; title: string; author: string; price: number; discountedPrice?: number;
  rating: number; reviews: number; cover: string; category?: string; isNew?: boolean;
  stock: boolean; description?: string;
};

export function toStoreBook(row: DatabaseBook | Record<string, unknown>): StoreBook {
  const available = row.stock === true;
  const rawImage = typeof row.image_url === "string" ? row.image_url : undefined;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BOOKS_BUCKET;
  const image = rawImage && /^https?:\/\//i.test(rawImage) && !rawImage.includes("YOUR_PROJECT_REF")
    ? rawImage
    : rawImage && bucket
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${rawImage.split("/").map(encodeURIComponent).join("/")}`
      : undefined;
  const description = typeof row.description === "string"
    ? row.description.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim()
    : undefined;
  return {
    id: String(row.id), title: String(row.title), author: String(row.author), price: Number(row.price),
    rating: 0, reviews: 0,
    cover: image ?? "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    category: row.category ? String(row.category) : undefined, isNew: false,
    stock: available,
    description,
  };
}
