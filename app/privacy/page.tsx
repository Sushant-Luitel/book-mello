import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Privacy Policy | BookMello",
  description: "Privacy policy and data protection guidelines at BookMello Nepal.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen bg-muted/20 py-10 sm:py-16">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue dark:text-blue-400 hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-12 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-5">
              <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif">Privacy Policy</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Last updated: October 2026 • BookMello Nepal</p>
              </div>
            </div>

            <div className="space-y-4 text-foreground/80 leading-relaxed text-sm sm:text-base">
              <h2 className="text-lg font-bold font-serif text-foreground">1. Information We Collect</h2>
              <p>
                When you place an order or contact us at BookMello, we collect essential information required to fulfill your order and deliver your books across Nepal:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Full name and delivery contact details (Mobile phone number)</li>
                <li>Delivery address (Province, City, Ward/Landmark)</li>
                <li>Order history and communication via WhatsApp or email</li>
              </ul>

              <h2 className="text-lg font-bold font-serif text-foreground pt-3">2. How We Use Your Information</h2>
              <p>
                Your information is used strictly to package and deliver your books, coordinate Cash On Delivery courier dispatches across Nepal, and notify you regarding order arrival. We never sell or share your personal data with third-party advertising brokers.
              </p>

              <h2 className="text-lg font-bold font-serif text-foreground pt-3">3. Cash on Delivery & Order Verification</h2>
              <p>
                For Cash On Delivery (COD) orders, our dispatch team may contact you via phone or WhatsApp (+977 9717028478) to verify your delivery address before dispatch.
              </p>

              <h2 className="text-lg font-bold font-serif text-foreground pt-3">4. Contact Us</h2>
              <p>
                If you have questions regarding your data or privacy, contact our support team at <a href="mailto:support@bookmello.com" className="text-brand-blue underline">support@bookmello.com</a> or via WhatsApp at <a href="https://wa.me/9779717028478" className="text-brand-blue underline">+977 9717028478</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
