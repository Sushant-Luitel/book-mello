import Image from "next/image";
import { ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNpr } from "@/lib/currency";
import type { CartItem } from "@/lib/cart-context";

interface Props {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  isSubmitting: boolean;
}

export function OrderSummary({ items, subtotal, shipping, total, isSubmitting }: Props) {
  return (
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="bg-card border border-border/70 rounded-2xl p-5 sm:p-6 shadow-md space-y-5">
                <h3 className="font-serif font-bold text-lg border-b border-border/50 pb-3">
                  Order Summary
                </h3>

                {/* Items preview */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-border/40">
                  {items.map(item => {
                    const price = item.book.discountedPrice ?? item.book.price ?? 550;
                    return (
                      <div key={item.book.id} className="flex items-center gap-3 pt-3 first:pt-0">
                        <div className="relative w-12 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                          <Image src={item.book.cover} alt={item.book.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-semibold text-xs line-clamp-1 text-foreground">{item.book.title}</h4>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{item.book.author}</p>
                          <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                        </div>
                        <div className="font-bold text-xs text-foreground shrink-0">
                          {formatNpr(price * item.quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Calculations */}
                <div className="border-t border-border/70 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="text-foreground font-medium">{formatNpr(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground items-center">
                    <span>Nationwide Delivery</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-bold text-xs bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                          FREE
                        </span>
                      ) : (
                        <span className="text-foreground font-medium">{formatNpr(shipping)}</span>
                      )}
                    </span>
                  </div>

                  {subtotal < 2500 && (
                    <p className="text-[11px] text-brand-blue dark:text-blue-400">
                      ✨ Add {formatNpr(2500 - subtotal)} more for Free Shipping!
                    </p>
                  )}

                  <div className="border-t border-border/70 pt-3 mt-3 flex justify-between font-serif text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-brand-blue dark:text-blue-400">{formatNpr(total)}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-13 rounded-full bg-brand-gold hover:bg-[#D08F0E] text-slate-950 font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  {isSubmitting ? "Placing Order..." : `Place Order • ${formatNpr(total)}`}
                </Button>

                {/* Trust guarantee points */}
                <div className="pt-2 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Guaranteed genuine editions with easy returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-blue shrink-0" />
                    <span>Courier dispatch with SMS & WhatsApp updates</span>
                  </div>
                </div>

              </div>
            </div>
  );
}
