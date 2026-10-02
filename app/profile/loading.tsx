import { Navbar } from "@/components/layout/navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF8F5] dark:bg-background pt-8 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border/50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-muted/50 z-0" />
                <div className="relative z-10 pt-4">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              </div>

              {/* Quick Stats Skeleton */}
              <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border/50 space-y-6">
                <Skeleton className="h-6 w-1/2" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl shrink-0"/>
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl shrink-0"/>
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Profile Details & Address Skeleton */}
              <section className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 space-y-6">
                <div>
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2"><Skeleton className="h-4 w-20"/><Skeleton className="h-10 w-full" /></div>
                  <div className="space-y-2"><Skeleton className="h-4 w-20"/><Skeleton className="h-10 w-full" /></div>
                  <div className="space-y-2"><Skeleton className="h-4 w-20"/><Skeleton className="h-10 w-full" /></div>
                  <div className="space-y-2"><Skeleton className="h-4 w-20"/><Skeleton className="h-10 w-full" /></div>
                </div>
              </section>

              {/* Wishlist Grid Skeleton */}
              <section className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 space-y-6">
                <div>
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   {Array.from({ length: 4 }).map((_, i) => (
                     <div key={i} className="flex flex-col gap-3 rounded-lg p-3 bg-card border border-border/50">
                       <Skeleton className="aspect-[2/3] w-full rounded-md" />
                       <Skeleton className="h-4 w-3/4" />
                       <Skeleton className="h-3 w-1/2" />
                     </div>
                   ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
