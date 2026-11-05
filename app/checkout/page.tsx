"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCheckout } from "@/hooks/use-checkout";
import { CheckoutFormFields } from "./_components/checkout-form-fields";
import { EmptyCart } from "./_components/empty-cart";
import { OrderConfirmation } from "./_components/order-confirmation";
import { OrderSummary } from "./_components/order-summary";

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, formData, setField, isSubmitting, completedOrder, submit } = useCheckout();

  if (completedOrder) return <OrderConfirmation order={completedOrder} />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen bg-muted/20 py-8 sm:py-12">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
          
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link href="/all" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-blue dark:text-blue-400 hover:underline mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif">Checkout</h1>
            </div>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {items.length} {items.length === 1 ? "Book" : "Books"} in Cart
            </span>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <CheckoutFormFields formData={formData} setField={setField} />
            </div>
            <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} isSubmitting={isSubmitting} />
          </form>

        </div>
      </main>
      <Footer />
    </>
  );
}
