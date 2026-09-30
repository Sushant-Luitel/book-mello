"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

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
  const { addToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast("success", `"${book.title}" added to cart`);
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
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span>{book.rating.toFixed(1)}</span>
          {book.category && (
            <>
              <span className="mx-1">•</span>
              <span>{book.category}</span>
            </>
          )}
        </div>
        
        <Link href={`/shop/${book.id}`} className="font-serif font-semibold leading-tight line-clamp-2 hover:text-accent transition-colors">
          {book.title}
        </Link>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {book.discountedPrice ? (
              <>
                <span className="font-semibold text-lg">${book.discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">${book.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-semibold text-lg">${book.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover Actions */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
        <Button size="icon" variant="secondary" className="rounded-full shadow-md bg-white text-primary hover:bg-accent hover:text-white dark:bg-card dark:text-foreground">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <Button className="w-full mt-2 gap-2" variant="outline" onClick={handleAddToCart}>
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  );
}
