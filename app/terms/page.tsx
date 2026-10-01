import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Terms of Service | BookMello",
  description: "Terms and conditions of ordering books from BookMello Nepal.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen bg-muted/20 py-10 sm:py-16">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F64AF] dark:text-blue-400 hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-12 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-5">
              <div className="w-12 h-12 rounded-full bg-[#E5A116]/15 flex items-center justify-center text-[#E5A116]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif">Terms of Service</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Last updated: October 2026 • BookMello Nepal</p>
              </div>
            </div>

            <div className="space-y-4 text-foreground/80 leading-relaxed text-sm sm:text-base">
              <h2 className="text-lg font-bold font-serif text-foreground">1. Introduction</h2>
              <p>
                Welcome to BookMello. By accessing our website, browsing our catalog, or placing an order online or via WhatsApp, you agree to these Terms of Service.
              </p>

              <h2 className="text-lg font-bold font-serif text-foreground pt-3">2. Orders & Cash On Delivery</h2>
              <p>
                We accept orders placed through our website checkout or directly via our verified WhatsApp (+977 9717028478). Cash on Delivery is available across all 7 provinces of Nepal. Customers are expected to provide accurate contact numbers and delivery addresses.
              </p>

              <h2 className="text-lg font-bold font-serif text-foreground pt-3">3. Delivery & Dispatch Times</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li><strong>Kathmandu Valley:</strong> Standard delivery within 24 to 48 hours.</li>
                <li><strong>Outside Valley / Nationwide:</strong> Standard delivery within 2 to 4 business days.</li>
                <li><strong>Free Delivery:</strong> Orders exceeding NPR 2,500 qualify for nationwide free shipping.</li>
              </ul>

              <h2 className="text-lg font-bold font-serif text-foreground pt-3">4. Book Authenticity & Returns</h2>
              <p>
                BookMello guarantees authentic books. If an item arrives damaged or misprinted, customers can request a replacement or return within 48 hours of delivery.
              </p>

              <h2 className="text-lg font-bold font-serif text-foreground pt-3">5. Customer Support</h2>
              <p>
                For any inquiries or assistance, contact us at <a href="https://wa.me/9779717028478" className="text-[#1F64AF] underline">+977 9717028478</a> or email <a href="mailto:support@bookmello.com" className="text-[#1F64AF] underline">support@bookmello.com</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
