import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { CartProvider } from "@/lib/cart-context";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bookmello.com";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BookMello | Your Next Read, Delivered Across Nepal",
    template: "%s | BookMello",
  },
  description:
    "BookMello is Nepal's independent online bookstore. Shop handpicked fiction, personal development, literary classics, and trending paperbacks with Cash on Delivery across all 7 provinces.",
  applicationName: "BookMello",
  keywords: [
    "online bookstore Nepal",
    "buy books Nepal",
    "cash on delivery books",
    "fiction books Nepal",
    "BookMello",
    "bookmello",
    "Nepali bookstore",
    "books delivered Nepal",
  ],
  authors: [{ name: "BookMello" }],
  creator: "BookMello",
  publisher: "BookMello",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/bookmello-logo.png", type: "image/png" }],
    apple: [{ url: "/bookmello-logo.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "BookMello",
    title: "BookMello | Connecting Pages With People",
    description:
      "Nepal's independent online bookstore. Handpicked books with Cash on Delivery across all 7 provinces. Order now at BookMello!",
    images: [
      {
        url: "/bookmello-og.jpg",
        width: 1200,
        height: 628,
        alt: "BookMello – Connecting Pages With People, Your Next Read Delivered Across Nepal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookMello | Connecting Pages With People",
    description:
      "Nepal's independent online bookstore. Handpicked books with Cash on Delivery across all 7 provinces.",
    images: ["/bookmello-og.jpg"],
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              name: "BookMello",
              url: siteUrl,
              logo: `${siteUrl}/bookmello-logo.png`,
              image: `${siteUrl}/bookmello-og.jpg`,
              description:
                "A carefully curated online bookstore for captivating stories and literary classics.",
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/all?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
