"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { formatNpr } from "@/lib/currency";

import { useCart } from "@/lib/cart-context";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    discountedPrice?: number;
    rating: number;
    cover: string;
    isNew?: boolean;
    category?: string;
  };
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart, openCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price > 0 ? book.price : 550,
      discountedPrice: book.discountedPrice,
      cover: book.cover,
      category: book.category,
    }, 1);
  };

  return (
    <div className="group flex flex-col gap-3 rounded-lg p-3 transition-all hover:bg-muted/50 hover:-translate-y-1 relative bg-card shadow-sm border border-border/50">
      <Link href={`/shop/${book.id}`} className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {book.isNew && (
          <Badge className="absolute top-2 left-2 bg-accent text-white border-none z-10">
            New
          </Badge>
        )}
        {book.discountedPrice && (
          <Badge variant="destructive" className="absolute top-2 right-2 z-10">
            Sale
          </Badge>
        )}
      </Link>
      
      <div className="flex flex-col flex-grow gap-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 flex-wrap">
          {book.rating > 0 ? (
            <>
              <Star className="h-3 w-3 fill-[#E5A116] text-[#E5A116]" />
              <span className="font-medium text-foreground">{book.rating.toFixed(1)}</span>
            </>
          ) : (
            <span className="text-[10px] font-semibold tracking-wide uppercase text-[#1F64AF] dark:text-blue-400 bg-[#1F64AF]/10 px-1.5 py-0.5 rounded-sm">
              Featured
            </span>
          )}
          {book.category && (
            <>
              <span className="text-muted-foreground/60">•</span>
              <span className="truncate">{book.category}</span>
            </>
          )}
        </div>
        
        <Link href={`/shop/${book.id}`} className="font-serif font-semibold leading-snug line-clamp-2 hover:text-[#1F64AF] transition-colors">
          {book.title}
        </Link>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{book.author}</p>
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base sm:text-lg text-foreground tracking-tight">
              {formatNpr(book.price)}
            </span>
            {book.discountedPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatNpr(book.discountedPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            In Stock
          </span>
        </div>
      </div>
      
      {/* Hover Actions */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
        <Button size="icon" variant="secondary" className="rounded-full shadow-md bg-white text-primary hover:bg-[#E5A116] hover:text-slate-950 dark:bg-card dark:text-foreground">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <Button className="w-full mt-2.5 gap-2 rounded-full border-border/70 hover:border-[#1F64AF] hover:text-[#1F64AF] font-semibold text-xs sm:text-sm" variant="outline" onClick={handleAddToCart}>
        <ShoppingCart className="h-3.5 w-3.5" />
        Add to Cart
      </Button>
    </div>
  );
}
