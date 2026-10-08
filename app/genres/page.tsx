import Link from "next/link";
import { Library, ArrowLeft } from "lucide-react";
import { getBooks } from "@/lib/books";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getCategoryIcon } from "@/lib/category-icons";

export const metadata = {
  title: "Browse Genres - Book Mellow",
  description: "Explore our complete collection of book genres.",
};

export default async function GenresPage() {
  const books = await getBooks();
  
  // Extract all unique categories and sort them alphabetically
  const categories = [
    ...new Set(books.map((book) => book.category).filter(Boolean) as string[]),
  ].sort((a, b) => a.localeCompare(b));

  // Count how many books are in each category
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: books.filter((b) => b.category === cat).length
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen bg-background flex flex-col">
        {/* Header Section */}
        <section className="w-full py-16 sm:py-24 bg-brand-blue/5 border-b border-border/40 relative overflow-hidden">
          {/* Aesthetic Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10 text-center max-w-3xl">
            <Link 
              href="/"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-brand-blue mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
            
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
                <Library className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-foreground mb-4">
              Explore All Genres
            </h1>
            <p className="text-lg text-muted-foreground">
              From gripping thrillers to epic fantasy, browse our entire catalog of curated genres to find your next unforgettable read.
            </p>
          </div>
        </section>

        {/* Grid Section */}
        <section className="w-full py-16 sm:py-20 flex-1">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {categoryCounts.map((category) => (
                <Link
                  key={category.name}
                  href={`/all?category=${encodeURIComponent(category.name)}`}
                  className="group relative h-40 rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-brand-blue p-5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center mb-3 group-hover:bg-brand-gold/20 transition-colors">
                    {getCategoryIcon(category.name, "h-6 w-6 text-brand-blue dark:text-blue-400 group-hover:text-brand-gold transition-colors")}
                  </div>
                  <h3 className="font-serif font-bold text-lg group-hover:text-brand-blue transition-colors mb-1">
                    {category.name}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {category.count} {category.count === 1 ? 'Book' : 'Books'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

