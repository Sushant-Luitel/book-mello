import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Truck, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { formatNpr } from "@/lib/currency";
import type { CompletedOrder } from "@/hooks/use-checkout";

export function OrderConfirmation({ order }: { order: CompletedOrder }) {
    const bookList = order.items.map(i => `${i.book.title} (x${i.quantity})`).join(", ");
    const whatsappText = encodeURIComponent(
      `Hello BookMello! I just placed an order:\n\n` +
      `📦 Order ID: ${order.orderId}\n` +
      `👤 Name: ${order.customer.fullName}\n` +
      `📞 Phone: ${order.customer.phone}\n` +
      `📍 Address: ${order.customer.address}, ${order.customer.city} (${order.customer.province})\n` +
      `📚 Books: ${bookList}\n` +
      `💰 Total: ${formatNpr(order.total)} (${order.customer.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'})\n\n` +
      `Please confirm my delivery! Thank you.`
    );

    return (
      <>
        <Navbar />
        <main className="flex-1 min-h-screen bg-muted/20 py-10 sm:py-16">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-3xl">
            <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 text-center sm:text-left">
              
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-border/70">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Order Received Successfully!
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                    Thank You, {order.customer.fullName}!
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your order reference is <span className="font-mono font-bold text-foreground">{order.orderId}</span>
                  </p>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/40 p-5 rounded-2xl border border-border/50 text-left">
                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-1">
                    Delivery Address:
                  </h4>
                  <p className="font-medium text-foreground">{order.customer.address}</p>
                  <p className="text-muted-foreground">{order.customer.city}, {order.customer.province}</p>
                  <p className="text-muted-foreground mt-1">Phone: {order.customer.phone}</p>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-1">
                    Payment & Timeframe:
                  </h4>
                  <p className="font-bold text-base text-brand-blue dark:text-blue-400">
                    {formatNpr(order.total)}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {order.customer.paymentMethod === "cod" ? "Pay Cash upon Delivery" : "Online QR Payment"}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> 24-48 Hours inside Kathmandu Valley (2-4 Days Nationwide)
                  </p>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-3 text-left">
                <h3 className="font-serif font-bold text-base">Items in this Order ({order.items.length})</h3>
                <div className="divide-y divide-border/60 border border-border/60 rounded-xl overflow-hidden bg-card">
                  {order.items.map(item => (
                    <div key={item.book.id} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded overflow-hidden bg-muted shrink-0">
                          <Image src={item.book.cover} alt={item.book.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground line-clamp-1">{item.book.title}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatNpr(item.book.discountedPrice ?? item.book.price ?? 550)}</p>
                        </div>
                      </div>
                      <div className="font-semibold text-sm">
                        {formatNpr((item.book.discountedPrice ?? item.book.price ?? 550) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <Button 
                  size="lg" 
                  className="flex-1 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold h-12 shadow-md gap-2" 
                  asChild
                >
                  <a 
                    href={`https://wa.me/9779717028478?text=${whatsappText}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Confirm Order on WhatsApp</span>
                  </a>
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1 rounded-full border-border/80 h-12 font-semibold" 
                  asChild
                >
                  <Link href="/all">
                    Continue Shopping
                  </Link>
                </Button>
              </div>

            </div>
          </div>
        </main>
        <Footer />
      </>
    );
}
