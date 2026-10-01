import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

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
    default: "BookMello | Discover Your Next Great Adventure",
    template: "%s | BookMello",
  },
  description: "Shop a carefully curated collection of captivating stories, nonfiction masterpieces, and literary classics at BookMello.",
  applicationName: "BookMello",
  keywords: ["online bookstore", "buy books", "fiction books", "nonfiction books", "BookMello"],
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
    title: "BookMello | Discover Your Next Great Adventure",
    description: "A carefully curated collection of captivating stories, nonfiction masterpieces, and literary classics.",
    images: [{ url: "/bookmello-og.png", width: 1200, height: 630, alt: "BookMello independent bookstore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookMello | Discover Your Next Great Adventure",
    description: "Shop captivating stories, nonfiction masterpieces, and literary classics at BookMello.",
    images: ["/bookmello-og.png"],
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
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
              image: `${siteUrl}/bookmello-og.png`,
              description: "A carefully curated online bookstore for captivating stories and literary classics.",
              potentialAction: { "@type": "SearchAction", target: `${siteUrl}/shop?search={search_term_string}`, "query-input": "required name=search_term_string" },
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
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
