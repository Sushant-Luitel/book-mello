"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Plus, Save, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

  useEffect(() => {
    let active = true;
    fetch("/api/v1/books", { cache: "no-store" }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Unable to load books"); return body.data ?? []; }).then((data) => { if (active) setBooks(data); }).catch((error) => { if (active) setMessage(error instanceof Error ? error.message : "Unable to load books"); });
    return () => { active = false; };
  }, []);

  const visibleBooks = useMemo(() => books.filter((book) => `${book.title} ${book.author} ${book.category ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())), [books, searchTerm]);
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
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden"><div className="p-4 border-b border-border"><div className="relative w-full sm:w-72"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search books..." className="pl-9 bg-background" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></div></div>
      <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-xs text-muted-foreground uppercase bg-muted/50"><tr><th className="px-6 py-4">Book</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Availability</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{visibleBooks.map((book) => <tr key={book.id} className="hover:bg-muted/30"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="relative h-12 w-8 rounded overflow-hidden shrink-0"><Image src={book.cover} alt={book.title} fill className="object-cover" /></div><div><div className="font-medium truncate max-w-[250px]">{book.title}</div><div className="text-muted-foreground text-xs">{book.author}</div></div></div></td><td className="px-6 py-4">{book.category ?? "—"}</td><td className="px-6 py-4 font-medium">{formatNpr(book.price)}</td><td className="px-6 py-4"><Badge variant={book.stock ? "default" : "destructive"}>{book.stock ? "In stock" : "Out of stock"}</Badge></td><td className="px-6 py-4 text-right"><Button variant="ghost" size="sm" onClick={() => startEdit(book)}><Edit className="h-4 w-4 mr-1" />Edit</Button></td></tr>)}</tbody></table></div>{!visibleBooks.length && <p className="p-8 text-center text-muted-foreground">No books found.</p>}</div>
    {editingId && <form onSubmit={saveBook} className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-5"><div className="flex items-center justify-between"><div><h2 className="text-xl font-serif font-semibold">Edit book</h2><p className="text-sm text-muted-foreground">Changes are saved directly to Supabase.</p></div><Button type="button" variant="ghost" size="icon" onClick={closeEdit}><X className="h-4 w-4" /></Button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><label className="text-sm font-medium">Title</label><Input required value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} /></div><div className="space-y-2"><label className="text-sm font-medium">Author</label><Input required value={draft.author} onChange={(event) => updateDraft("author", event.target.value)} /></div><div className="space-y-2"><label className="text-sm font-medium">Price (NPR)</label><Input required min="0" step="0.01" type="number" value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} /></div><div className="space-y-2"><label className="text-sm font-medium">Category</label><Input value={draft.category} onChange={(event) => updateDraft("category", event.target.value)} /></div></div><div className="space-y-2"><label className="text-sm font-medium">Image URL</label><Input type="url" placeholder="https://.../cover.jpg" value={draft.image_url} onChange={(event) => updateDraft("image_url", event.target.value)} /></div><div className="space-y-2"><label className="text-sm font-medium">Description</label><textarea className="min-h-32 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} /></div><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={draft.stock} onChange={(event) => updateDraft("stock", event.target.checked)} /> Available in stock</label><div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={closeEdit}>Cancel</Button><Button type="submit" disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save changes"}</Button></div></form>}
  </div>;
}
