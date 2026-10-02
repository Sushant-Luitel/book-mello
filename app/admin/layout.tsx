"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  LayoutDashboard, 
  Book, 
  ShoppingCart, 
  Users, 
  Tags, 
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/books", label: "Books", icon: Book },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      
      if (profile?.role !== 'ADMIN') {
        router.push("/");
        return;
      }
      
      setIsAuthorized(true);
    };

    checkAdmin();
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center bg-muted/20 text-muted-foreground">Checking authorization...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-20">
        <Link href="/admin" className="flex items-center gap-2 text-primary">
          <BookOpen className="h-6 w-6" />
          <span className="font-serif font-bold text-lg">Admin</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-card border-r border-border w-64 flex-col fixed md:sticky top-0 h-screen z-10 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 hidden md:flex items-center gap-2 text-primary border-b border-border/50">
          <BookOpen className="h-6 w-6" />
          <span className="font-serif font-bold text-xl tracking-tight">Book Mellow</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Dashboard</div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-sm",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto space-y-2">
          <Link 
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
            Settings
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-full">
        {children}
      </main>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
