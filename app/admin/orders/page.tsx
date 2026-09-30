"use client";

import { useState } from "react";
import { Search, Filter, Eye, MoreHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

const MOCK_ORDERS = [
  { id: "ORD-7352", customer: "Alice Johnson", email: "alice@example.com", date: "Oct 24, 2023", items: 3, total: 84.50, status: "Delivered", payment: "Paid" },
  { id: "ORD-7351", customer: "Robert Smith", email: "robert@example.com", date: "Oct 24, 2023", items: 1, total: 24.99, status: "Processing", payment: "Paid" },
  { id: "ORD-7350", customer: "Emily Davis", email: "emily@example.com", date: "Oct 23, 2023", items: 5, total: 142.00, status: "Shipped", payment: "Paid" },
  { id: "ORD-7349", customer: "Michael Wilson", email: "michael@example.com", date: "Oct 22, 2023", items: 2, total: 54.00, status: "Pending", payment: "Pending" },
  { id: "ORD-7348", customer: "Sarah Taylor", email: "sarah@example.com", date: "Oct 21, 2023", items: 1, total: 18.50, status: "Cancelled", payment: "Refunded" },
];

export default function AdminOrdersPage() {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Delivered": return "bg-green-500/10 text-green-700 hover:bg-green-500/20";
      case "Processing": return "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20";
      case "Shipped": return "bg-purple-500/10 text-purple-700 hover:bg-purple-500/20";
      case "Pending": return "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-700 hover:bg-red-500/20";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif mb-1">Orders</h1>
        <p className="text-muted-foreground text-sm">View and manage customer orders.</p>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-9 bg-background" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto gap-2 bg-background">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-background">Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {order.date}
                  </td>
                  <td className="px-6 py-4">
                    {order.items} books
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-normal border-transparent ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
