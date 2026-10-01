"use client";

import Link from "next/link";
import { ArrowLeft, Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function NewBookPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/books">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-serif mb-1">Add New Book</h1>
          <p className="text-muted-foreground text-sm">Create a new book listing in your store.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-semibold font-serif border-b border-border pb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="E.g. The Great Gatsby" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Author</label>
                  <Input placeholder="E.g. F. Scott Fitzgerald" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <option>Select a category</option>
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Science Fiction</option>
                    <option>Mystery</option>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                {/* Fake Rich Text Editor UI */}
                <div className="border border-input rounded-md overflow-hidden flex flex-col">
                  <div className="bg-muted/50 border-b border-input p-2 flex gap-1">
                    <button className="p-1.5 hover:bg-muted rounded text-sm font-bold">B</button>
                    <button className="p-1.5 hover:bg-muted rounded text-sm italic">I</button>
                    <button className="p-1.5 hover:bg-muted rounded text-sm underline">U</button>
                    <div className="w-px h-6 bg-border mx-1 self-center"></div>
                    <button className="p-1.5 hover:bg-muted rounded text-sm">h1</button>
                    <button className="p-1.5 hover:bg-muted rounded text-sm">h2</button>
                  </div>
                  <textarea 
                    className="w-full min-h-[150px] p-3 focus:outline-none bg-background resize-y text-sm"
                    placeholder="Write a compelling description..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-semibold font-serif border-b border-border pb-4">Publishing Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">ISBN</label>
                <Input placeholder="978-..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Publisher</label>
                <Input placeholder="Publisher name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Publication Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select>
                  <option>Hardcover</option>
                  <option>Paperback</option>
                  <option>E-Book</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pages</label>
                <Input type="number" placeholder="e.g. 350" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Pricing & Inventory */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-semibold font-serif border-b border-border pb-4">Pricing & Stock</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (NPR)</label>
                <Input type="number" placeholder="0.00" step="0.01" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Compare at Price (NPR)</label>
                <Input type="number" placeholder="0.00" step="0.01" />
                <p className="text-xs text-muted-foreground">To show a discounted price, enter the original price here.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Quantity</label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-semibold font-serif border-b border-border pb-4">Cover Image</h2>
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mb-4">SVG, PNG, JPG or GIF (max. 800x1200px)</p>
              <Button type="button" variant="outline" size="sm">Select File</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
        <Button variant="outline">Cancel</Button>
        <Button>Save Book</Button>
      </div>
    </div>
  );
}
