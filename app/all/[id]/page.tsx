"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Heart, Share2, Truck, ShieldCheck, ChevronDown, Check, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StoreBook } from "@/lib/book-shape";
import { formatNpr } from "@/lib/currency";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { BookReviews, Stars } from "@/components/reviews/book-reviews";
import type { ReviewSummary } from "@/lib/services/reviews";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const [book, setBook] = useState<StoreBook | null>(null);
  const { addToCart, openCart } = useCart();
  useEffect(() => { fetch(`/api/v1/books/${bookId}`).then((response) => response.json()).then((body) => setBook(body.data ?? null)).catch(() => setBook(null)); }, [bookId]);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [summary, setSummary] = useState<Pick<ReviewSummary, "average" | "count"> | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { has, toggle } = useWishlist();
  const handleSummaryChange = useCallback((next: ReviewSummary) => setSummary({ average: next.average, count: next.count }), []);

  useEffect(() => {
    if (book) setMainImage(book.cover);
  }, [book]);

  const handleAddToCart = () => {
    if (!book) return;
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price > 0 ? book.price : 550,
      discountedPrice: book.discountedPrice,
      cover: book.cover,
      category: book.category,
    }, quantity);
    openCart();
  };

  const handleBuyNow = () => {
    if (!book) return;
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price > 0 ? book.price : 550,
      discountedPrice: book.discountedPrice,
      cover: book.cover,
      category: book.category,
    }, quantity);
    router.push("/checkout");
  };

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
            <Link href="/all" className="hover:text-primary transition-colors">All</Link>
            <span className="mx-2">/</span>
            <Link href={`/all?category=${book.category}`} className="hover:text-primary transition-colors">{book.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium truncate">{book.title}</span>
          </div>
        </div>

        <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
          {/* Product Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4 items-center md:items-start">
              <div className="relative aspect-[3/4] w-full max-w-xs sm:max-w-sm lg:max-w-sm mx-auto md:mx-0 rounded-xl overflow-hidden shadow-xl bg-muted border border-border/50">
                <Image
                  src={mainImage || book.cover}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {book.images && book.images.length > 1 && (
                <div className="flex gap-4 justify-center md:justify-start">
                  {book.images.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setMainImage(img)}
                      className={`relative w-20 h-28 rounded-md overflow-hidden border-2 cursor-pointer transition-all ${mainImage === img ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <Image src={img} alt={`${book.title} view ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {book.isNew && <Badge className="w-fit mb-4 bg-accent text-white border-none">New Arrival</Badge>}
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-primary dark:text-primary-foreground mb-2 text-balance">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">by <span className="text-foreground font-medium">{book.author}</span></p>
              
              {(() => {
                const average = summary?.average ?? book.rating;
                const count = summary?.count ?? book.reviews;
                return (
                  <div className="flex items-center gap-4 mb-6">
                    {count > 0 ? (
                      <div className="flex items-center gap-2">
                        <Stars value={average} />
                        <span className="font-medium text-sm">{average.toFixed(1)}</span>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="text-sm text-muted-foreground underline"
                      onClick={() => { setActiveTab("reviews"); tabsRef.current?.scrollIntoView({ behavior: "smooth" }); }}
                    >
                      {count > 0 ? `${count} Review${count > 1 ? "s" : ""}` : "Be the first to review"}
                    </button>
                  </div>
                );
              })()}

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
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center border border-input rounded-full bg-background h-12 px-2 self-start sm:self-auto">
                    <button 
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                    <button 
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      disabled={!book.stock || quantity >= 99}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="flex-1 gap-2 text-sm sm:text-base rounded-full border-2 border-[#1F64AF] bg-white text-[#1F64AF] hover:bg-[#1F64AF] hover:text-white dark:bg-card transition-colors font-bold h-12" 
                    disabled={!book.stock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>

                  <Button 
                    size="lg" 
                    className="flex-1 gap-2 text-sm sm:text-base rounded-full bg-[#E5A116] hover:bg-[#D08F0E] text-slate-950 font-bold shadow-md hover:shadow-lg transition-all h-12" 
                    disabled={!book.stock}
                    onClick={handleBuyNow}
                  >
                    <Zap className="h-4 w-4 fill-current" /> Buy Now (COD)
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    className={`h-12 w-12 shrink-0 rounded-full self-start sm:self-auto ${has(book.id) ? "border-brand-gold text-brand-gold" : ""}`}
                    aria-pressed={has(book.id)}
                    aria-label={has(book.id) ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={() => void toggle({ id: book.id, title: book.title })}
                  >
                    <Heart className={`h-5 w-5 ${has(book.id) ? "fill-current" : ""}`} />
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
          <div className="mb-16" ref={tabsRef}>
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
                Reviews ({summary?.count ?? book.reviews})
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

              {activeTab === 'reviews' && <BookReviews bookId={book.id} onSummaryChange={handleSummaryChange} />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
