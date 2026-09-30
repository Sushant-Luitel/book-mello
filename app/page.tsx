import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BOOKS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { BookCard } from "@/components/books/book-card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  const featuredBooks = MOCK_BOOKS.slice(0, 4);
  const newArrivals = MOCK_BOOKS.filter(b => b.isNew).concat(MOCK_BOOKS.slice(4, 6));

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-40 flex items-center bg-secondary overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)"/>
            </svg>
          </div>
          
          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-primary dark:text-primary-foreground text-balance">
                    Discover your next great adventure.
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    A carefully curated collection of the world's most captivating stories, non-fiction masterpieces, and literary classics.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="w-full sm:w-auto text-base" asChild>
                    <Link href="/shop">
                      Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base" asChild>
                    <Link href="/about">
                      Our Story
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative w-[280px] h-[400px] md:w-[320px] md:h-[460px] transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl rounded-lg overflow-hidden">
                  <Image
                    src={MOCK_BOOKS[0].cover}
                    alt="Featured Book"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Books */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight mb-2">Staff Picks</h2>
                <p className="text-muted-foreground">Hand-selected favorites from our team.</p>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center text-sm font-medium text-accent hover:underline">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="w-full py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight mb-4">Browse by Genre</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Explore our diverse collection of genres and discover something new to read.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {MOCK_CATEGORIES.map((category, i) => (
                <Link 
                  key={category} 
                  href={`/shop?category=${encodeURIComponent(category)}`}
                  className="group relative h-32 md:h-40 rounded-xl overflow-hidden bg-background border border-border/50 flex flex-col items-center justify-center p-6 text-center hover:border-accent transition-colors shadow-sm"
                >
                  <BookOpen className="h-8 w-8 mb-3 text-muted-foreground group-hover:text-accent transition-colors" />
                  <h3 className="font-serif font-medium text-lg">{category}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight mb-2">New Arrivals</h2>
                <p className="text-muted-foreground">Fresh off the press and ready to be read.</p>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 gap-6 snap-x snap-mandatory hide-scrollbar">
              {newArrivals.map(book => (
                <div key={`new-${book.id}`} className="min-w-[240px] max-w-[280px] snap-start">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="w-full py-16 md:py-24 px-4 md:px-6">
          <div className="container mx-auto rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="max-w-xl relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Summer Reading Challenge</h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Join our summer reading challenge and get 20% off all fiction titles. Plus, earn an exclusive tote bag when you read 5 books.
              </p>
              <Button size="lg" variant="accent" className="w-full md:w-auto">
                Learn More
              </Button>
            </div>
            
            <div className="relative z-10 w-full max-w-sm">
              <div className="grid grid-cols-2 gap-4 transform rotate-6">
                <Image src={MOCK_BOOKS[1].cover} alt="Book" width={160} height={240} className="rounded-lg shadow-xl" />
                <Image src={MOCK_BOOKS[2].cover} alt="Book" width={160} height={240} className="rounded-lg shadow-xl -mt-8" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
