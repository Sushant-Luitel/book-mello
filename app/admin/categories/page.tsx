"use client";

import { useState, useEffect, useMemo } from "react";
import { Tag, BookOpen, Loader2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<
    { name: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = () => {
    setLoading(true);
    fetch("/api/v1/categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        // We'll also fetch books to get the counts for these categories
        fetch("/api/v1/books", { cache: "no-store" })
          .then((res) => res.json())
          .then((bookData) => {
            const books = bookData.data ?? [];
            const stats = (data.data ?? []).map((cat: string) => ({
              name: cat,
              count: books.filter((b: any) => b.category === cat).length,
            }));
            setCategories(stats.sort((a: any, b: any) => b.count - a.count));
            setLoading(false);
          });
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/v1/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add category");

      setSuccess(`Category "${newCategory}" added successfully!`);
      setNewCategory("");
      loadCategories(); // refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-1">Categories</h1>
          <p className="text-muted-foreground text-sm">
            Organize your books into genres.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleAddCategory}
        className="bg-card border border-border p-5 rounded-lg shadow-sm space-y-4"
      >
        <h2 className="font-semibold font-serif text-lg">Add New Category</h2>
        {error && (
          <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm font-medium text-green-600 bg-green-500/10 p-3 rounded-md">
            {success}
          </p>
        )}

        <div className="flex gap-3">
          <Input
            placeholder="e.g. Science Fiction"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="max-w-md"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !newCategory.trim()}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Category
          </Button>
        </div>
      </form>

      {/* Hidden */}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border shadow-sm">
          No categories found in your catalog.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-card rounded-lg border border-border p-5 flex items-center justify-between shadow-sm group hover:border-primary/50 transition-colors"
            >
              <div>
                <h3 className="font-semibold font-serif text-lg">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> {cat.count} book
                  {cat.count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
