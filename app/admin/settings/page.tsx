"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Store, Truck, Bell } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [storeName, setStoreName] = useState("BookMello");
  const [supportPhone, setSupportPhone] = useState("+977 9717028478");
  const [freeShippingMin, setFreeShippingMin] = useState("2500");
  const [standardDeliveryFee, setStandardDeliveryFee] = useState("120");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("success", "Settings saved successfully");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-serif">Store Settings</h1>
        <p className="text-muted-foreground text-sm">Configure BookMello Nepal operations and delivery parameters.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3">
            <Store className="w-4 h-4 text-[#1F64AF]" />
            <h2 className="font-serif font-bold text-lg">General Store Info</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Store Name</label>
              <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Support WhatsApp / Phone</label>
              <Input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3">
            <Truck className="w-4 h-4 text-[#E5A116]" />
            <h2 className="font-serif font-bold text-lg">Delivery & Shipping Rules (Nepal)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Standard Delivery Fee (NPR)</label>
              <Input type="number" value={standardDeliveryFee} onChange={(e) => setStandardDeliveryFee(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Free Shipping Threshold (NPR)</label>
              <Input type="number" value={freeShippingMin} onChange={(e) => setFreeShippingMin(e.target.value)} />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="rounded-full bg-[#1F64AF] hover:bg-[#154D8A] gap-2 px-8">
          <Save className="w-4 h-4" /> Save Settings
        </Button>
      </form>
    </div>
  );
}
