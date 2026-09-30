"use client";

import { useState } from "react";
import { Search, Shield, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const MOCK_USERS = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", joined: "Jan 12, 2023" },
  { id: "2", name: "Robert Smith", email: "robert@example.com", role: "User", status: "Active", joined: "Mar 05, 2023" },
  { id: "3", name: "Emily Davis", email: "emily@example.com", role: "User", status: "Inactive", joined: "Apr 22, 2023" },
  { id: "4", name: "Michael Wilson", email: "michael@example.com", role: "User", status: "Active", joined: "Jun 18, 2023" },
  { id: "5", name: "Sarah Taylor", email: "sarah@example.com", role: "Moderator", status: "Active", joined: "Aug 30, 2023" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif mb-1">Users</h1>
        <p className="text-muted-foreground text-sm">Manage registered users and roles.</p>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9 bg-background" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-muted-foreground text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === "Admin" && <Shield className="h-4 w-4 text-primary" />}
                      <span className="font-medium">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-normal border-transparent ${user.status === 'Active' ? 'bg-green-500/10 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        Edit
                      </Button>
                    </div>
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
