import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { BookCard } from "@/components/books/book-card";
import { ProfileForm } from "@/components/profile/profile-form";
import { User, Package, Heart, LogOut, Mail, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNpr } from "@/lib/currency";

export const metadata = {
  title: "My Profile - BookMellow",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: wishlist } = await supabase
    .from("wishlist_items")
    .select("..., books(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  async function handleLogout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF8F5] dark:bg-background pt-8 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border/50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#E5A116]/20 to-[#E5A116]/5 z-0" />
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-serif font-bold shadow-md border-4 border-white dark:border-card">
                    {profile?.full_name?.charAt(0).toUpperCase() || <User />}
                  </div>
                  <h2 className="mt-4 text-xl font-bold font-serif">{profile?.full_name || "Customer"}</h2>
                  <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1">
                    <Mail className="h-3 w-3" /> {profile?.email}
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-border/50 flex justify-center">
                    <form action={handleLogout}>
                      <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full flex items-center justify-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border/50">
                <h3 className="font-semibold text-lg mb-4 font-serif">Your Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#E5A116]/10 text-[#E5A116] rounded-xl">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{wishlist?.length || 0} Books</p>
                      <p className="text-xs text-muted-foreground">In Wishlist</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{orders?.length || 0} Orders</p>
                      <p className="text-xs text-muted-foreground">Placed Total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Profile Details & Address */}
              <section className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
                    <Settings className="h-6 w-6 text-primary" />
                    Account Settings
                  </h2>
                  <p className="text-muted-foreground mt-1">Manage your details and delivery address.</p>
                </div>
                
                <ProfileForm profile={profile} />
              </section>

              {/* Wishlist Section */}
              <section className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
                      <Heart className="h-6 w-6 text-red-500 fill-current" />
                      My Wishlist
                    </h2>
                    <p className="text-muted-foreground mt-1">Books you've saved for later.</p>
                  </div>
                </div>

                {!wishlist || wishlist.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                    <Heart className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Your wishlist is currently empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlist.map((item: any) => (
                      item.books && <BookCard key={item.id} book={item.books} />
                    ))}
                  </div>
                )}
              </section>

              {/* Order History Section */}
              <section className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    Order History
                  </h2>
                  <p className="text-muted-foreground mt-1">Track your recent book deliveries.</p>
                </div>

                {!orders || orders.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                    <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border/70 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
                        <div>
                          <p className="font-mono text-sm font-bold">{order.order_number}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold">{formatNpr(order.total_amount)}</p>
                            <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                              {order.fulfillment_status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
