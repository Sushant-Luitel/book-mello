"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_BOOKS } from "@/lib/mock-data";

export default function AdminBooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-1">Books</h1>
          <p className="text-muted-foreground text-sm">Manage your bookstore inventory.</p>
        </div>
        <Button asChild>
          <Link href="/admin/books/new">
            <Plus className="h-4 w-4 mr-2" /> Add New Book
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search books..." 
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="flex h-10 w-full sm:w-auto items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>All Categories</option>
              <option>Fiction</option>
              <option>Non-Fiction</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Book</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_BOOKS.map((book) => (
                <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-8 rounded overflow-hidden shrink-0">
                        <Image src={book.cover} alt={book.title} fill className="object-cover" />
                      </div>
                      <div className="max-w-[200px]">
                        <div className="font-medium text-foreground truncate">{book.title}</div>
                        <div className="text-muted-foreground text-xs truncate">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {book.category}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${book.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 ${book.stock < 10 ? 'text-yellow-600' : 'text-foreground'}`}>
                      {book.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={book.stock > 0 ? "default" : "destructive"} className="font-normal bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">
                      Active
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <div>Showing 1 to 6 of 6 entries</div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 min-w-[2rem] bg-primary text-primary-foreground">1</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
