import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
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
            <Button size="lg" className="rounded-full bg-brand-blue hover:bg-brand-blue-dark px-8 font-bold" asChild>
              <Link href="/all" className="inline-flex items-center gap-2">
                <span>Browse Collection</span>
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
}
