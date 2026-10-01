"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/layout/cart-drawer";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const submitSearch = (event: React.FormEvent) => { event.preventDefault(); const query = searchQuery.trim(); router.push(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop"); setMobileMenuOpen(false); };
  const navClass = (href: string) => cn("text-sm font-medium hover:text-accent transition-colors", pathname === href && "text-accent");

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-secondary/95 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-secondary/95 backdrop-blur-md border-b border-border py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="BookMello home">
            <Image src="/bookmello-logo.png" alt="BookMello" width={126} height={59} priority className="h-12 w-auto object-contain" />
          </Link>
  
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={navClass("/")}>Home</Link>
            <Link href="/shop" className={navClass("/shop")}>Shop</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <form className="relative w-64" onSubmit={submitSearch}>
              <label htmlFor="desktop-book-search" className="sr-only">Search books and authors</label>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="desktop-book-search"
                type="search"
                placeholder="Search books, authors..."
                className="w-full pl-9 bg-background/50 border-border/50 focus-visible:bg-background"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </form>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle color theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Button variant="outline" size="icon" aria-label="Open shopping cart" className="relative border-border/50" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                2
              </Badge>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <Button variant="outline" size="icon" aria-label="Open shopping cart" className="relative border-border/50" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                2
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-secondary border-b border-border p-4 shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-2">
          <form className="relative w-full" onSubmit={submitSearch}>
            <label htmlFor="mobile-book-search" className="sr-only">Search books and authors</label>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="mobile-book-search"
              type="search"
              placeholder="Search books, authors..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </form>
          <nav className="flex flex-col gap-2">
            <Link href="/" className={cn("px-4 py-3 rounded-md hover:bg-secondary font-medium", pathname === "/" && "bg-secondary text-accent")} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/shop" className={cn("px-4 py-3 rounded-md hover:bg-secondary font-medium", pathname === "/shop" && "bg-secondary text-accent")} onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <div className="h-px bg-border my-2"></div>
            <Link href="/login" className="px-4 py-3 rounded-md hover:bg-secondary font-medium flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <User className="h-4 w-4" /> Account
            </Link>
            <button 
              className="px-4 py-3 rounded-md hover:bg-secondary font-medium flex items-center gap-2 text-left"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setMobileMenuOpen(false);
              }}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Toggle Theme
            </button>
          </nav>
        </div>
      )}

    </header>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
