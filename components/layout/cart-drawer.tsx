"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNpr } from "@/lib/currency";
import { useCart } from "@/lib/cart-context";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, subtotal, shipping, total, totalCount } = useCart();

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity animate-in fade-in" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-background shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300 border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#1F64AF]" />
            <h2 className="text-xl font-bold font-serif">Your Cart</h2>
            <span className="bg-[#E5A116] text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {totalCount} {totalCount === 1 ? "item" : "items"}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted" aria-label="Close cart">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold font-serif">Your cart is empty</p>
                <p className="text-muted-foreground text-sm mt-1 mb-6">Looks like you haven&apos;t added any books yet.</p>
                <Button onClick={onClose} className="rounded-full bg-[#1F64AF] hover:bg-[#154D8A]" asChild>
                  <Link href="/shop">Start Browsing Books</Link>
                </Button>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const bookPrice = item.book.discountedPrice ?? item.book.price ?? 550;
              const displayPrice = bookPrice > 0 ? bookPrice : 550;
              return (
                <div key={item.book.id} className="flex gap-4 group bg-card p-3 rounded-xl border border-border/60 relative shadow-xs">
                  <Link href={`/shop/${item.book.id}`} className="relative h-24 w-18 shrink-0 rounded-md overflow-hidden bg-muted" onClick={onClose}>
                    <Image src={item.book.cover} alt={item.book.title} fill className="object-cover" />
                  </Link>
                  
                  <div className="flex flex-col flex-1 min-w-0 pr-6">
                    <Link href={`/shop/${item.book.id}`} className="font-serif font-bold text-sm leading-snug line-clamp-1 hover:text-[#1F64AF] transition-colors" onClick={onClose}>
                      {item.book.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.book.author}</p>
                    
                    <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center border border-border rounded-full bg-background h-7 px-1">
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground text-xs font-bold"
                          onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >-</button>
                        <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground text-xs font-bold"
                          onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      
                      <div className="font-bold text-sm text-foreground">
                        {formatNpr(displayPrice * item.quantity)}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.book.id)}
                      className="absolute top-3 right-3 text-muted-foreground/60 hover:text-destructive transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-muted/20 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">{formatNpr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground items-center">
                <span>Delivery across Nepal</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold text-xs bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      Free Shipping
                    </span>
                  ) : (
                    <span className="text-foreground font-medium">{formatNpr(shipping)}</span>
                  )}
                </span>
              </div>
              {subtotal < 2500 && (
                <p className="text-[11px] text-muted-foreground">
                  Add <span className="font-semibold text-[#1F64AF]">{formatNpr(2500 - subtotal)}</span> more for Free Delivery!
                </p>
              )}
              <div className="border-t border-border pt-3 mt-2 flex justify-between font-serif text-lg font-bold">
                <span>Total (Cash On Delivery)</span>
                <span className="text-[#1F64AF] dark:text-blue-400">{formatNpr(total)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={onClose} className="rounded-full" asChild>
                <Link href="/shop">Continue Browsing</Link>
              </Button>
              <Button className="rounded-full bg-[#E5A116] hover:bg-[#D08F0E] text-slate-950 font-bold shadow-md hover:shadow-lg" asChild>
                <Link href="/checkout" onClick={onClose} className="flex items-center justify-center gap-1.5">
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
