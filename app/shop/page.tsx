"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookCard } from "@/components/books/book-card";
import type { StoreBook } from "@/lib/book-shape";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopPage() { return <Suspense fallback={<div className="min-h-screen bg-muted/20" />}><ShopContent /></Suspense>; }

function ShopContent() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12, total: 0, totalPages: 1 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const queryString = searchParams.toString();
  useEffect(() => { const controller = new AbortController(); fetch(`/api/v1/books?${queryString}`, { signal: controller.signal }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); return body; }).then((body) => { setBooks(body.data ?? []); setCategories(body.facets?.categories ?? []); setPagination(body.pagination); }).catch((error) => { if (error.name !== "AbortError") setBooks([]); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, [queryString]);
  function updateFilters(changes: Record<string, string | null>) { const next = new URLSearchParams(searchParams.toString()); Object.entries(changes).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key)); if (!("page" in changes)) next.delete("page"); router.push(`${pathname}?${next.toString()}`); }
  const allBooks = books;

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col min-h-screen bg-muted/20">
        <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mx-auto flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-tight mb-2">All Books</h1>
              <p className="text-muted-foreground">Showing {allBooks.length} of {pagination.total} results</p>
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
                <Select className="w-[180px]" value={searchParams.get("sort") ?? "newest"} onChange={(event) => updateFilters({ sort: event.target.value })}>
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
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
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category}`} checked={searchParams.get("category") === category} onChange={(event) => updateFilters({ category: event.target.checked ? category : null })} />
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
                      <Checkbox id="price-1" checked={searchParams.get("maxPrice") === "999"} onChange={(event) => updateFilters({ minPrice: null, maxPrice: event.target.checked ? "999" : null })} />
                        <label htmlFor="price-1" className="text-sm font-medium cursor-pointer">Under NPR 1,000</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-2" checked={searchParams.get("minPrice") === "1000" && searchParams.get("maxPrice") === "2500"} onChange={(event) => updateFilters({ minPrice: event.target.checked ? "1000" : null, maxPrice: event.target.checked ? "2500" : null })} />
                        <label htmlFor="price-2" className="text-sm font-medium cursor-pointer">NPR 1,000 - 2,500</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-3" checked={searchParams.get("minPrice") === "2500" && searchParams.get("maxPrice") === "5000"} onChange={(event) => updateFilters({ minPrice: event.target.checked ? "2500" : null, maxPrice: event.target.checked ? "5000" : null })} />
                        <label htmlFor="price-3" className="text-sm font-medium cursor-pointer">NPR 2,500 - 5,000</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-4" checked={searchParams.get("minPrice") === "5001"} onChange={(event) => updateFilters({ minPrice: event.target.checked ? "5001" : null, maxPrice: null })} />
                        <label htmlFor="price-4" className="text-sm font-medium cursor-pointer">Over NPR 5,000</label>
                    </div>
                  </div>
                </div>

                <div><h3 className="font-serif font-semibold text-lg mb-4">Availability</h3><div className="flex items-center space-x-2"><Checkbox id="available" checked={searchParams.get("available") === "true"} onChange={(event) => updateFilters({ available: event.target.checked ? "true" : null })} /><label htmlFor="available" className="text-sm font-medium cursor-pointer">In stock only</label></div></div>
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
              
              {!loading && !allBooks.length && <p className="py-16 text-center text-muted-foreground">No books match these filters.</p>}
              {!loading && pagination.totalPages > 1 && <div className="mt-12 flex justify-center items-center gap-2"><Button variant="outline" disabled={pagination.page <= 1} onClick={() => updateFilters({ page: String(pagination.page - 1) })}>Previous</Button>{Array.from({ length: pagination.totalPages }, (_, index) => index + 1).slice(Math.max(0, pagination.page - 3), Math.min(pagination.totalPages, pagination.page + 2)).map((page) => <Button key={page} variant={page === pagination.page ? "default" : "outline"} size="icon" onClick={() => updateFilters({ page: String(page) })}>{page}</Button>)}<Button variant="outline" disabled={pagination.page >= pagination.totalPages} onClick={() => updateFilters({ page: String(pagination.page + 1) })}>Next</Button></div>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
