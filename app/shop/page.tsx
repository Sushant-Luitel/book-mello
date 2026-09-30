"use client";

import { useState } from "react";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookCard } from "@/components/books/book-card";
import { MOCK_BOOKS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  });

  // Duplicate books to make the grid look full for demo
  const allBooks = [...MOCK_BOOKS, ...MOCK_BOOKS.map(b => ({...b, id: b.id + "_copy"}))];

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col min-h-screen bg-muted/20">
        <div className="container px-4 md:px-6 py-8 mx-auto flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-tight mb-2">All Books</h1>
              <p className="text-muted-foreground">Showing 1-12 of 24 results</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="md:hidden w-full gap-2"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <Filter className="h-4 w-4" /> Filters
              </Button>
              
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select className="w-[180px]">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Popularity</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters (Desktop) */}
            <aside className={`w-full md:w-64 shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
              <div className="space-y-8 sticky top-24">
                {/* Categories */}
                <div>
                  <h3 className="font-serif font-semibold text-lg mb-4 flex items-center justify-between">
                    Categories
                  </h3>
                  <div className="space-y-3">
                    {MOCK_CATEGORIES.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category}`} />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-serif font-semibold text-lg mb-4">Price</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-1" />
                      <label htmlFor="price-1" className="text-sm font-medium cursor-pointer">Under $10</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-2" />
                      <label htmlFor="price-2" className="text-sm font-medium cursor-pointer">$10 - $25</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-3" />
                      <label htmlFor="price-3" className="text-sm font-medium cursor-pointer">$25 - $50</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-4" />
                      <label htmlFor="price-4" className="text-sm font-medium cursor-pointer">Over $50</label>
                    </div>
                  </div>
                </div>

                {/* Format */}
                <div>
                  <h3 className="font-serif font-semibold text-lg mb-4">Format</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="format-hc" />
                      <label htmlFor="format-hc" className="text-sm font-medium cursor-pointer">Hardcover</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="format-pb" />
                      <label htmlFor="format-pb" className="text-sm font-medium cursor-pointer">Paperback</label>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Book Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {loading ? (
                  // Skeletons
                  Array(8).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-lg p-3 relative bg-card border border-border/50">
                      <Skeleton className="aspect-[2/3] w-full rounded-md" />
                      <div className="space-y-2 mt-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                      </div>
                    </div>
                  ))
                ) : (
                  // Actual books
                  allBooks.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))
                )}
              </div>
              
              {!loading && (
                <div className="mt-12 flex justify-center">
                  <Button variant="outline" className="w-full md:w-auto">Load More Books</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
