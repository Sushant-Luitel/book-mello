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
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isCartOpen, setIsCartOpen, totalCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single();
        setProfile(data);
      }
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', session.user.id).single();
          setProfile(data);
        } else {
          setUser(null);
          setProfile(null);
        }
      });
      
      return () => subscription.unsubscribe();
    };
    
    fetchUser();
  }, []);

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
    {/* Top Announcement / Trust Bar */}
    <div className="bg-[#1F64AF] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
      <div className="container mx-auto flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E5A116] animate-pulse"></span>
          Delivered Across Nepal • Cash On Delivery Available
        </span>
        <a 
          href="https://wa.me/9779717028478" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hidden sm:inline-flex items-center gap-1 hover:underline text-white/90"
        >
          <span>WhatsApp:</span> <span className="font-semibold">+977 9717028478</span>
        </a>
      </div>
    </div>

    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/80 shadow-xs py-2.5"
          : "bg-background/80 backdrop-blur-sm border-b border-border/40 py-3.5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="BookMello home">
            <Image 
              src="/bookmello-logo.svg" 
              alt="BookMello" 
              width={160} 
              height={40} 
              priority 
              className="h-8 sm:h-9 w-auto object-contain dark:brightness-110" 
            />
          </Link>
  
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/" className={navClass("/")}>Home</Link>
            <Link href="/shop" className={navClass("/shop")}>Shop All</Link>
            <Link href="/shop?filter=featured" className="text-sm font-medium hover:text-accent transition-colors">Staff Picks</Link>
            <Link href="/shop?filter=new" className="text-sm font-medium hover:text-accent transition-colors">New Arrivals</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <form className="relative w-56 lg:w-64" onSubmit={submitSearch}>
              <label htmlFor="desktop-book-search" className="sr-only">Search books and authors</label>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="desktop-book-search"
                type="search"
                placeholder="Search books, authors..."
                className="w-full pl-9 h-9 text-sm bg-muted/40 border-border/60 focus-visible:bg-background rounded-full transition-all"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </form>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              aria-label="Toggle color theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Link href={user ? "/profile" : "/login"}>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden" aria-label="Account">
                {user ? (
                  <div className="w-full h-full bg-[#E5A116] text-slate-900 flex items-center justify-center font-serif font-bold text-sm">
                    {profile?.full_name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                  </div>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </Button>
            </Link>

            <Button 
              variant="outline" 
              size="icon" 
              aria-label="Open shopping cart" 
              className="relative h-9 w-9 rounded-full border-border/60 hover:border-accent hover:text-accent transition-colors" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 flex items-center justify-center p-0 text-[10px] bg-[#E5A116] text-slate-900 font-bold border-none">
                {totalCount}
              </Badge>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              aria-label="Open shopping cart" 
              className="relative h-9 w-9 rounded-full border-border/60" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 flex items-center justify-center p-0 text-[10px] bg-[#E5A116] text-slate-900 font-bold border-none">
                {totalCount}
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-2">
          <form className="relative w-full" onSubmit={submitSearch}>
            <label htmlFor="mobile-book-search" className="sr-only">Search books and authors</label>
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="mobile-book-search"
              type="search"
              placeholder="Search books, authors..."
              className="w-full pl-9 h-10 rounded-full bg-muted/40"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </form>
          <nav className="flex flex-col gap-1">
            <Link href="/" className={cn("px-4 py-2.5 rounded-lg hover:bg-muted font-medium transition-colors", pathname === "/" && "bg-muted text-accent")} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/shop" className={cn("px-4 py-2.5 rounded-lg hover:bg-muted font-medium transition-colors", pathname === "/shop" && "bg-muted text-accent")} onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
            <Link href="/shop?filter=featured" className="px-4 py-2.5 rounded-lg hover:bg-muted font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Staff Picks</Link>
            <Link href="/shop?filter=new" className="px-4 py-2.5 rounded-lg hover:bg-muted font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
            <div className="h-px bg-border my-2"></div>
            <Link href="/login" className="px-4 py-2.5 rounded-lg hover:bg-muted font-medium flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
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
    <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
