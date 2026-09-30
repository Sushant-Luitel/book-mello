"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { MOCK_BOOKS } from "@/lib/mock-data";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-1">Categories</h1>
          <p className="text-muted-foreground text-sm">Organize your books into genres.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_CATEGORIES.map((category) => (
          <div key={category} className="bg-card rounded-lg border border-border p-5 flex items-center justify-between shadow-sm group hover:border-primary/50 transition-colors">
            <div>
              <h3 className="font-semibold font-serif text-lg">{category}</h3>
              <p className="text-xs text-muted-foreground mt-1">{MOCK_BOOKS.filter((book) => book.category === category).length} books</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
