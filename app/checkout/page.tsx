"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Phone, 
  MapPin, 
  CreditCard,
  Banknote,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNpr } from "@/lib/currency";
import { useCart } from "@/lib/cart-context";

const NEPAL_PROVINCES = [
  "Bagmati Province (Kathmandu, Lalitpur, Bhaktapur)",
  "Gandaki Province (Pokhara, etc.)",
  "Koshi Province (Biratnagar, Dharan, etc.)",
  "Madhesh Province (Janakpur, Birgunj, etc.)",
  "Lumbini Province (Butwal, Bhairahawa, etc.)",
  "Karnali Province (Surkhet, etc.)",
  "Sudurpashchim Province (Dhangadhi, etc.)",
];

const POPULAR_CITIES = [
  "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan / Bharatpur", "Butwal", "Biratnagar", "Dharan", "Hetauda"
];

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: NEPAL_PROVINCES[0],
    city: "Kathmandu",
    address: "",
    notes: "",
    paymentMethod: "cod", // "cod" | "qr"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    items: typeof items;
    subtotal: number;
    shipping: number;
    total: number;
    customer: typeof formData;
    placedAt: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert("Please fill in your name, phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const orderId = `BM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const order = {
        orderId,
        items: [...items],
        subtotal,
        shipping,
        total,
        customer: { ...formData },
        placedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      };

      setCompletedOrder(order);
      clearCart();
      setIsSubmitting(false);
    }, 600);
  };

  // Order Confirmation View
  if (completedOrder) {
    const bookList = completedOrder.items.map(i => `${i.book.title} (x${i.quantity})`).join(", ");
    const whatsappText = encodeURIComponent(
      `Hello BookMello! I just placed an order:\n\n` +
      `📦 Order ID: ${completedOrder.orderId}\n` +
      `👤 Name: ${completedOrder.customer.fullName}\n` +
      `📞 Phone: ${completedOrder.customer.phone}\n` +
      `📍 Address: ${completedOrder.customer.address}, ${completedOrder.customer.city} (${completedOrder.customer.province})\n` +
      `📚 Books: ${bookList}\n` +
      `💰 Total: ${formatNpr(completedOrder.total)} (${completedOrder.customer.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'})\n\n` +
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
                    Thank You, {completedOrder.customer.fullName}!
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your order reference is <span className="font-mono font-bold text-foreground">{completedOrder.orderId}</span>
                  </p>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/40 p-5 rounded-2xl border border-border/50 text-left">
                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-1">
                    Delivery Address:
                  </h4>
                  <p className="font-medium text-foreground">{completedOrder.customer.address}</p>
                  <p className="text-muted-foreground">{completedOrder.customer.city}, {completedOrder.customer.province}</p>
                  <p className="text-muted-foreground mt-1">Phone: {completedOrder.customer.phone}</p>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-1">
                    Payment & Timeframe:
                  </h4>
                  <p className="font-bold text-base text-[#1F64AF] dark:text-blue-400">
                    {formatNpr(completedOrder.total)}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {completedOrder.customer.paymentMethod === "cod" ? "Pay Cash upon Delivery" : "Online QR Payment"}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> 24-48 Hours inside Kathmandu Valley (2-4 Days Nationwide)
                  </p>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-3 text-left">
                <h3 className="font-serif font-bold text-base">Items in this Order ({completedOrder.items.length})</h3>
                <div className="divide-y divide-border/60 border border-border/60 rounded-xl overflow-hidden bg-card">
                  {completedOrder.items.map(item => (
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
                  <Link href="/shop">
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

  // Empty Cart View
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 min-h-[70vh] flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full text-center space-y-5 bg-card border border-border/60 p-8 sm:p-10 rounded-3xl shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-bold font-serif">Your Cart is Empty</h1>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t added any books to your cart yet. Explore our curated catalog and discover your next read!
            </p>
            <Button size="lg" className="rounded-full bg-[#1F64AF] hover:bg-[#154D8A] px-8 font-bold" asChild>
              <Link href="/shop" className="inline-flex items-center gap-2">
                <span>Browse Collection</span>
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Active Checkout Form View
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen bg-muted/20 py-8 sm:py-12">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
          
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1F64AF] dark:text-blue-400 hover:underline mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif">Checkout</h1>
            </div>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {items.length} {items.length === 1 ? "Book" : "Books"} in Cart
            </span>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Customer Info & Shipping Address (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Contact Information */}
              <div className="bg-card border border-border/70 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <Phone className="w-4 h-4 text-[#1F64AF]" />
                  <h2 className="font-serif font-bold text-lg">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone Number (Mobile) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="98XXXXXXXX / 97XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Address (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="For order receipt & updates"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card border border-border/70 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <MapPin className="w-4 h-4 text-[#E5A116]" />
                  <h2 className="font-serif font-bold text-lg">Delivery Address in Nepal</h2>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F64AF]"
                  >
                    {NEPAL_PROVINCES.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    City / Town / Area <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Baneshwor, Kathmandu"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="rounded-xl h-11"
                  />
                  {/* Quick City Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {POPULAR_CITIES.slice(0, 5).map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setFormData({ ...formData, city: c })}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted hover:bg-[#1F64AF]/15 hover:text-[#1F64AF] font-medium transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Street Address & Nearby Landmark <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="House/Ward number, Street name, Near School/Chowk"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Order Notes / Delivery Instructions (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Call before coming, deliver in afternoon"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border/70 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <h2 className="font-serif font-bold text-lg">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {/* COD Option */}
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-[#1F64AF] bg-[#1F64AF]/5' : 'border-border/70 hover:border-border'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                      className="mt-1 text-[#1F64AF] focus:ring-[#1F64AF]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">Cash On Delivery (COD)</span>
                        <span className="text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">Recommended</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pay cash directly to our delivery courier when the books reach your doorstep. You can inspect the book package before paying.
                      </p>
                    </div>
                  </label>

                  {/* Fonepay / QR Option */}
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors cursor-pointer ${formData.paymentMethod === 'qr' ? 'border-[#1F64AF] bg-[#1F64AF]/5' : 'border-border/70 hover:border-border'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qr"
                      checked={formData.paymentMethod === "qr"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "qr" })}
                      className="mt-1 text-[#1F64AF] focus:ring-[#1F64AF]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">Fonepay / eSewa / Khalti QR</span>
                        <span className="text-xs text-muted-foreground">Digital</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        We will send the official BookMello payment QR code on WhatsApp or upon courier arrival.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right: Order Summary (5 cols) */}
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
                    <p className="text-[11px] text-[#1F64AF] dark:text-blue-400">
                      ✨ Add {formatNpr(2500 - subtotal)} more for Free Shipping!
                    </p>
                  )}

                  <div className="border-t border-border/70 pt-3 mt-3 flex justify-between font-serif text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-[#1F64AF] dark:text-blue-400">{formatNpr(total)}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-13 rounded-full bg-[#E5A116] hover:bg-[#D08F0E] text-slate-950 font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer"
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
                    <Truck className="w-4 h-4 text-[#1F64AF] shrink-0" />
                    <span>Courier dispatch with SMS & WhatsApp updates</span>
                  </div>
                </div>

              </div>
            </div>

          </form>

        </div>
      </main>
      <Footer />
    </>
  );
}
