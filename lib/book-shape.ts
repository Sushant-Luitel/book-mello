export type DatabaseBook = {
  id: string; title: string; author: string; description: string | null;
  price: number | string; stock: boolean; image_url: string | null;
  created_at: string; updated_at: string; category: string | null;
  is_featured?: boolean; is_new?: boolean;
};

/** View model expected by the bookstore UI. */
export type StoreBook = {
  id: string; title: string; author: string; price: number; discountedPrice?: number;
  rating: number; reviews: number; cover: string; category?: string; isNew?: boolean;
  isFeatured?: boolean; stock: boolean; description?: string;
};

export function toStoreBook(row: DatabaseBook | Record<string, unknown>): StoreBook {
  const available = row.stock !== false;
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
  
  const rawPrice = Number(row.price);
  const parsedPrice = !isNaN(rawPrice) && rawPrice > 0 ? rawPrice : 650;
  
  return {
    id: String(row.id),
    title: String(row.title),
    author: String(row.author),
    price: parsedPrice,
    rating: 4.6 + ((String(row.id).charCodeAt(0) % 4) * 0.1),
    reviews: 12 + ((String(row.id).charCodeAt(1) || 5) * 3),
    cover: image ?? "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    category: row.category ? String(row.category) : undefined,
    isNew: Boolean(row.is_new ?? false),
    isFeatured: Boolean(row.is_featured ?? false),
    stock: available,
    description,
  };
}
