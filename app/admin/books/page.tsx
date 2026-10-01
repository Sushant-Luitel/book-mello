"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Save, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { StoreBook } from "@/lib/book-shape";
import { formatNpr } from "@/lib/currency";

type AdminBook = StoreBook & { image_url: string | null };

export default function AdminBooksPage() {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftImage, setDraftImage] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/books", { cache: "no-store" })
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Unable to load books"); return body.data ?? []; })
      .then((data) => { if (!cancelled) setBooks(data); })
      .catch((error) => { if (!cancelled) setMessage(error instanceof Error ? error.message : "Unable to load books"); });
    return () => { cancelled = true; };
  }, []);

  const visibleBooks = useMemo(() => books.filter((book) => `${book.title} ${book.author} ${book.category ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())), [books, searchTerm]);

  function beginEdit(book: AdminBook) { setEditingId(book.id); setDraftImage(book.image_url ?? ""); setMessage(""); }

  async function saveImage(book: AdminBook) {
    setSavingId(book.id); setMessage("");
    try {
      const response = await fetch(`/api/v1/books/${book.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image_url: draftImage.trim() || null }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to update image");
      setBooks((current) => current.map((item) => item.id === book.id ? { ...item, ...body.data, image_url: draftImage.trim() || null } : item));
      setEditingId(null); setMessage("Image URL updated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update image"); }
    finally { setSavingId(null); }
  }

  return <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-3xl font-bold font-serif mb-1">Books</h1><p className="text-muted-foreground text-sm">Manage the live Supabase catalog.</p></div><Button asChild><Link href="/admin/books/new"><Plus className="h-4 w-4 mr-2" /> Add New Book</Link></Button></div>
    {message && <p className="rounded-md bg-muted px-3 py-2 text-sm">{message}</p>}
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden"><div className="p-4 border-b border-border"><div className="relative w-full sm:w-72"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search books..." className="pl-9 bg-background" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></div></div>
      <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-xs text-muted-foreground uppercase bg-muted/50"><tr><th className="px-6 py-4">Book</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Availability</th><th className="px-6 py-4">Image URL</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{visibleBooks.map((book) => <tr key={book.id} className="hover:bg-muted/30"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="relative h-12 w-8 rounded overflow-hidden shrink-0"><Image src={book.cover} alt={book.title} fill className="object-cover" /></div><div><div className="font-medium truncate max-w-[220px]">{book.title}</div><div className="text-muted-foreground text-xs">{book.author}</div></div></div></td><td className="px-6 py-4">{book.category ?? "—"}</td><td className="px-6 py-4 font-medium">{formatNpr(book.price)}</td><td className="px-6 py-4"><Badge variant={book.stock ? "default" : "destructive"}>{book.stock ? "In stock" : "Out of stock"}</Badge></td><td className="px-6 py-4 min-w-[280px]">{editingId === book.id ? <Input value={draftImage} onChange={(event) => setDraftImage(event.target.value)} placeholder="https://.../cover.jpg" /> : <span className="text-xs text-muted-foreground break-all">{book.image_url ?? "No image URL"}</span>}</td><td className="px-6 py-4 text-right">{editingId === book.id ? <Button size="sm" onClick={() => saveImage(book)} disabled={savingId === book.id}><Save className="h-4 w-4 mr-1" />{savingId === book.id ? "Saving" : "Save"}</Button> : <Button variant="ghost" size="sm" onClick={() => beginEdit(book)}><Edit className="h-4 w-4 mr-1" />Image</Button>}</td></tr>)}</tbody></table></div>
      {!visibleBooks.length && <p className="p-8 text-center text-muted-foreground">No books found.</p>}
    </div>
  </div>;
}

