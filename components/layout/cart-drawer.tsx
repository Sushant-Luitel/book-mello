"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BOOKS } from "@/lib/mock-data";
import { formatNpr } from "@/lib/currency";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
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

  const [cartItems, setCartItems] = useState([
    { book: MOCK_BOOKS[0], quantity: 1 },
    { book: MOCK_BOOKS[1], quantity: 2 },
  ]);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.book.discountedPrice || item.book.price;
    return acc + price * item.quantity;
  }, 0);
  
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.book.id !== id));
  };

  const updateQuantity = (id: string, newQ: number) => {
    if (newQ < 1) return;
    setCartItems(cartItems.map(item => item.book.id === id ? { ...item, quantity: newQ } : item));
  };

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
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold font-serif">Your Cart</h2>
            <span className="bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-2">
              {cartItems.length}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-muted-foreground text-sm mt-1 mb-6">Looks like you haven't added any books yet.</p>
                <Button onClick={onClose} asChild>
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.book.id} className="flex gap-4 group bg-card p-3 rounded-lg border border-border/50 relative">
                <Link href={`/shop/${item.book.id}`} className="relative h-28 w-20 shrink-0 rounded overflow-hidden" onClick={onClose}>
                  <Image src={item.book.cover} alt={item.book.title} fill className="object-cover" />
                </Link>
                
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start pr-6">
                    <div>
                      <Link href={`/shop/${item.book.id}`} className="font-serif font-medium line-clamp-1 hover:text-accent transition-colors" onClick={onClose}>
                        {item.book.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.book.author}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex items-center border border-input rounded flex-shrink-0 bg-background h-8">
                      <button 
                        className="px-2 py-1 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 text-xs font-medium"
                        onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                      <button 
                        className="px-2 py-1 text-muted-foreground hover:bg-muted transition-colors text-xs font-medium"
                        onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                      >+</button>
                    </div>
                    
                    <div className="font-medium text-sm">
                      {formatNpr((item.book.discountedPrice || item.book.price) * item.quantity)}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.book.id)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border bg-muted/20 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatNpr(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium text-xs bg-green-100 px-2 py-0.5 rounded-sm dark:bg-green-900/30 dark:text-green-400">Free</span> : formatNpr(shipping)}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-serif text-lg font-bold">
                <span>Total</span>
                <span>{formatNpr(total)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button variant="outline" onClick={onClose} asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button>Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
