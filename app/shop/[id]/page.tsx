"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, ShoppingCart, Heart, Share2, Truck, ShieldCheck, ChevronDown, Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StoreBook } from "@/lib/book-shape";
import { formatNpr } from "@/lib/currency";

export default function BookDetailsPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<StoreBook | null>(null);
  useEffect(() => { fetch(`/api/v1/books/${bookId}`).then((response) => response.json()).then((body) => setBook(body.data ?? null)).catch(() => setBook(null)); }, [bookId]);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  if (!book) return <main className="min-h-screen flex items-center justify-center">Loading book…</main>;

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 py-3 flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <Link href={`/shop?category=${book.category}`} className="hover:text-primary transition-colors">{book.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium truncate">{book.title}</span>
          </div>
        </div>

        <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
          {/* Product Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto md:max-w-none rounded-xl overflow-hidden shadow-xl bg-muted border border-border/50">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex gap-4 justify-center md:justify-start">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`relative w-20 h-28 rounded-md overflow-hidden border-2 cursor-pointer ${i === 1 ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <Image src={book.cover} alt="Thumbnail" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {book.isNew && <Badge className="w-fit mb-4 bg-accent text-white border-none">New Arrival</Badge>}
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-primary dark:text-primary-foreground mb-2 text-balance">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">by <span className="text-foreground font-medium">{book.author}</span></p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= Math.round(book.rating) ? 'fill-accent text-accent' : 'fill-muted text-muted'}`} 
                    />
                  ))}
                  <span className="ml-1 font-medium text-sm">{book.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground underline cursor-pointer">{book.reviews} Reviews</span>
              </div>

              <div className="flex items-end gap-3 mb-6">
                {book.discountedPrice ? (
                  <>
                    <span className="text-3xl font-bold">{formatNpr(book.discountedPrice)}</span>
                    <span className="text-lg text-muted-foreground line-through mb-1">{formatNpr(book.price)}</span>
                    <Badge variant="destructive" className="mb-2">Sale</Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold">{formatNpr(book.price)}</span>
                )}
              </div>

              <p className="text-muted-foreground mb-8 leading-relaxed line-clamp-3 whitespace-pre-line">
                {book.description ?? `${book.title} by ${book.author}.`}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`h-4 w-4 ${book.stock ? "text-green-600" : "text-red-600"}`} />
                  <span className={`font-medium ${book.stock ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>{book.stock ? "In Stock" : "Out of Stock"}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-input rounded-md">
                    <button 
                      className="px-3 py-2 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >-</button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      className="px-3 py-2 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      disabled={!book.stock || quantity >= 99}
                    >+</button>
                  </div>
                  
                  <Button size="lg" className="flex-1 gap-2 text-base" disabled={!book.stock}>
                    <ShoppingCart className="h-5 w-5" /> Add to Cart
                  </Button>
                  
                  <Button size="icon" variant="outline" className="h-11 w-11 shrink-0">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="h-5 w-5" />
                  <span>Free shipping on orders over NPR 5,000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Secure checkout process</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-16">
            <div className="flex border-b border-border">
              <button 
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'description' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
                {activeTab === 'description' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'details' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('details')}
              >
                Product Details
                {activeTab === 'details' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'reviews' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({book.reviews})
                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
              </button>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose dark:prose-invert max-w-4xl space-y-4 text-muted-foreground">
                  <p className="whitespace-pre-line">{book.description ?? "No description is available for this book."}</p>
                  <h3 className="text-xl font-serif font-bold text-foreground mt-8 mb-4">About the Author</h3>
                  <p>
                    {book.author} is an award-winning writer known for their captivating storytelling and deeply human characters. They currently reside in a cozy cabin surrounded by thousands of books.
                  </p>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="max-w-2xl">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-border">
                      <tr><th className="py-3 font-medium text-muted-foreground w-1/3">Format</th><td className="py-3 font-medium">Hardcover</td></tr>
                      <tr><th className="py-3 font-medium text-muted-foreground">Pages</th><td className="py-3 font-medium">352</td></tr>
                      <tr><th className="py-3 font-medium text-muted-foreground">Publisher</th><td className="py-3 font-medium">Penguin Random House</td></tr>
                      <tr><th className="py-3 font-medium text-muted-foreground">Publication Date</th><td className="py-3 font-medium">October 24, 2023</td></tr>
                      <tr><th className="py-3 font-medium text-muted-foreground">Language</th><td className="py-3 font-medium">English</td></tr>
                      <tr><th className="py-3 font-medium text-muted-foreground">ISBN-13</th><td className="py-3 font-medium">978-0123456789</td></tr>
                      <tr><th className="py-3 font-medium text-muted-foreground">Dimensions</th><td className="py-3 font-medium">6.2 x 1.2 x 9.3 inches</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-1 space-y-6">
                    <div className="text-center md:text-left">
                      <h3 className="text-4xl font-bold font-serif mb-2">{book.rating.toFixed(1)}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-5 w-5 ${star <= Math.round(book.rating) ? 'fill-accent text-accent' : 'fill-muted text-muted'}`} />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm">Based on {book.reviews} reviews</p>
                    </div>
                    
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center text-sm">
                          <span className="w-12">{rating} Stars</span>
                          <div className="flex-1 mx-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: rating === 5 ? '80%' : rating === 4 ? '15%' : '2%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full">Write a Review</Button>
                  </div>
                  
                  <div className="md:col-span-2 space-y-8">
                    {/* Mock Reviews */}
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b border-border pb-8 last:border-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                              {String.fromCharCode(64 + review)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">User {String.fromCharCode(64 + review)}</p>
                              <div className="flex text-accent mt-0.5">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3 w-3 fill-current" />)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">Oct {10 + review}, 2023</span>
                        </div>
                        <h4 className="font-semibold text-sm mb-2">Absolutely loved it!</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          This book was incredible from start to finish. The character development was phenomenal, and I found myself unable to put it down. Highly recommend to anyone who enjoys this genre!
                        </p>
                        <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <span>Helpful (12)</span>
                          </button>
                          <button className="hover:text-foreground transition-colors">Report</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
