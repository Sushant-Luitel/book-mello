"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Plus, Save, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNpr } from "@/lib/currency";
import type { StoreBook } from "@/lib/book-shape";

type AdminBook = StoreBook & { image_url: string | null };
type Draft = { title: string; author: string; description: string; price: string; stock: boolean; image_url: string; category: string };

const emptyDraft: Draft = { title: "", author: "", description: "", price: "", stock: true, image_url: "", category: "" };

export default function AdminBooksPage() {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/v1/books?pageSize=1000", { cache: "no-store" }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Unable to load books"); return body.data ?? []; }).then((data) => { if (active) { setBooks(data); setLoading(false); } }).catch((error) => { if (active) { setMessage(error instanceof Error ? error.message : "Unable to load books"); setLoading(false); } });
    
    fetch("/api/v1/categories")
      .then(res => res.json())
      .then(data => {
        if (active && data && data.data) setCategories(data.data);
      })
      .catch(() => {});
      
    return () => { active = false; };
  }, []);

  const filteredBooks = useMemo(() => books.filter((book) => `${book.title} ${book.author} ${book.category ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())), [books, searchTerm]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / itemsPerPage));
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  const paginatedBooks = useMemo(() => filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredBooks, currentPage]);

  const startEdit = (book: AdminBook) => { setEditingId(book.id); setMessage(""); setDraft({ title: book.title, author: book.author, description: book.description ?? "", price: String(book.price), stock: book.stock, image_url: book.image_url ?? "", category: book.category ?? "" }); };
  const closeEdit = () => { setEditingId(null); setDraft(emptyDraft); };
  const updateDraft = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  async function saveBook(event: React.FormEvent) {
    event.preventDefault(); if (!editingId) return; setSaving(true); setMessage("");
    try {
      const response = await fetch(`/api/v1/books/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: draft.title, author: draft.author, description: draft.description || null, price: Number(draft.price), stock: draft.stock, image_url: draft.image_url.trim() || null, category: draft.category.trim() || null }) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Unable to update book");
      setBooks((current) => current.map((book) => book.id === editingId ? { ...book, ...body.data, image_url: draft.image_url.trim() || null } : book)); closeEdit(); setMessage("Book updated successfully.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update book"); } finally { setSaving(false); }
  }

  return <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-3xl font-bold font-serif mb-1">Books</h1><p className="text-muted-foreground text-sm">Manage the live Supabase catalog.</p></div><Button asChild><Link href="/admin/books/new"><Plus className="h-4 w-4 mr-2" /> Add New Book</Link></Button></div>
    {message && <p className="rounded-md bg-muted px-3 py-2 text-sm">{message}</p>}
    <Card>
      <CardHeader className="p-4 border-b">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search books..." className="pl-9" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">Loading books...</TableCell></TableRow> : paginatedBooks.map((book) => 
        editingId === book.id ? (
          <TableRow key={book.id} className="bg-muted/30">
            <TableCell colSpan={5}>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="font-serif text-lg">Edit Book</CardTitle>
                  <Button variant="ghost" size="icon" onClick={closeEdit}><X className="h-4 w-4"/></Button>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-semibold">Title</label><Input value={draft.title} onChange={(e) => updateDraft("title", e.target.value)} /></div>
                  <div className="space-y-1"><label className="text-xs font-semibold">Author</label><Input value={draft.author} onChange={(e) => updateDraft("author", e.target.value)} /></div>
                  <div className="space-y-1"><label className="text-xs font-semibold">Price (NPR)</label><Input type="number" value={draft.price} onChange={(e) => updateDraft("price", e.target.value)} /></div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Category</label>
                    <Input list="edit-categories" value={draft.category} onChange={(e) => updateDraft("category", e.target.value)} />
                    <datalist id="edit-categories">
                      {categories.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                </div>
                <div className="space-y-1"><label className="text-xs font-semibold">Image URLs (comma separated for multiple)</label><Input type="text" placeholder="https://image1.jpg, https://image2.jpg" value={draft.image_url} onChange={(e) => updateDraft("image_url", e.target.value)} /></div>
                <div className="space-y-1"><label className="text-xs font-semibold">Description</label><textarea className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]" value={draft.description} onChange={(e) => updateDraft("description", e.target.value)} /></div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={draft.stock} onChange={(e) => updateDraft("stock", e.target.checked)} /> Available in stock</label>
                  <Button onClick={saveBook} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save"}</Button>
                </div>
                </CardContent>
              </Card>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow key={book.id}>
            <TableCell><div className="flex items-center gap-3"><div className="relative h-12 w-8 rounded overflow-hidden shrink-0"><Image src={book.cover} alt={book.title} fill className="object-cover" /></div><div><div className="font-medium truncate max-w-[250px]">{book.title}</div><div className="text-muted-foreground text-xs">{book.author}</div></div></div></TableCell>
            <TableCell>{book.category ?? "—"}</TableCell>
            <TableCell className="font-medium">{formatNpr(book.price)}</TableCell>
            <TableCell><Badge variant={book.stock ? "default" : "destructive"}>{book.stock ? "In stock" : "Out of stock"}</Badge></TableCell>
            <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => startEdit(book)}><Edit className="h-4 w-4 mr-1" />Edit</Button></TableCell>
          </TableRow>
        )
      )}
          </TableBody>
        </Table>
      </CardContent>
      
      {!loading && filteredBooks.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground hidden sm:block">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBooks.length)} of {filteredBooks.length} books
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <div className="text-sm font-medium mx-2">
                  Page {currentPage} of {totalPages}
                </div>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {!loading && !filteredBooks.length && <p className="p-8 text-center text-muted-foreground">No books found.</p>}
    </Card>
  </div>;
}
