"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Save, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProfileForm({ profile }: { profile: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    province: profile?.province || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      addToast("success", "Profile & delivery address updated successfully!");
      router.refresh();
    } catch (error) {
      addToast("error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input name="phone" placeholder="98XXXXXXXX" value={formData.phone} onChange={handleChange} />
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Default Delivery Address
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Street Address</label>
            <Input name="address" placeholder="123 Book St, Apt 4" value={formData.address} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input name="city" placeholder="Kathmandu" value={formData.city} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Province/State</label>
              <Input name="province" placeholder="Bagmati" value={formData.province} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading} className="gap-2 bg-[#E5A116] hover:bg-[#D08F0E] text-slate-900">
          <Save className="h-4 w-4" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
