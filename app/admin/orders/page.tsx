"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatNpr } from "@/lib/currency";
type Order = { id: string; order_number: string; user_id: string | null; created_at: string; total_amount: number | string; fulfillment_status: string; order_items?: { id: string; quantity: number }[] };
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]); const [search, setSearch] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; fetch("/api/v1/orders", { cache: "no-store" }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Unable to load orders"); return body.data ?? []; }).then((data) => { if (active) { setOrders(data); setLoading(false); } }).catch((reason) => { if (active) { setError(reason instanceof Error ? reason.message : "Unable to load orders"); setLoading(false); } }); return () => { active = false; }; }, []);
  const filtered = useMemo(() => orders.filter((order) => `${order.order_number} ${order.user_id ?? ""}`.toLowerCase().includes(search.toLowerCase())), [orders, search]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  useEffect(() => { setCurrentPage(1); }, [search]);
  const visible = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage]);
  const statusClass = (status: string) => status === "DELIVERED" ? "bg-green-500/10 text-green-700" : status === "CANCELLED" ? "bg-red-500/10 text-red-700" : status === "SHIPPED" ? "bg-purple-500/10 text-purple-700" : "bg-yellow-500/10 text-yellow-700";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif mb-1">Orders</h1>
        <p className="text-muted-foreground text-sm">Live orders from Supabase.</p>
      </div>
      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      
      <Card>
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Button variant="outline" className="hidden sm:flex gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">Loading orders...</TableCell>
                </TableRow>
              ) : (
                visible.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{order.user_id ?? "Guest"}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{order.order_items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0} books</TableCell>
                    <TableCell className="font-medium">{formatNpr(order.total_amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-transparent ${statusClass(order.fulfillment_status)}`}>
                        {order.fulfillment_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} orders
            </div>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <div className="text-sm font-medium mx-2">
                    Page {currentPage} of {totalPages}
                  </div>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {!loading && !filtered.length && <p className="p-10 text-center text-muted-foreground">No orders found.</p>}
      </Card>
    </div>
  );
}
