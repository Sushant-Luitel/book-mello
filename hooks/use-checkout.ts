"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { apiRequest } from "@/lib/api-client";
import { useCart, type CartItem } from "@/lib/cart-context";
import { NEPAL_PROVINCES } from "@/lib/constants/nepal";
import { customerSchema, type CustomerInput } from "@/lib/validation/checkout";

export type CheckoutFormData = Required<CustomerInput>;

export interface CompletedOrder {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: CheckoutFormData;
  placedAt: string;
}

interface PlacedOrderResponse {
  order_number: string;
  subtotal: number | string;
  shipping_fee: number | string;
  total_amount: number | string;
  created_at: string;
}

export function useCheckout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    phone: "",
    email: "",
    province: NEPAL_PROVINCES[0],
    city: "Kathmandu",
    address: "",
    notes: "",
    paymentMethod: "cod",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  const setField = <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  // Prefill the form from the signed-in user's profile.
  useEffect(() => {
    const prefill = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, address, city, province")
        .eq("id", user.id)
        .single();
      if (!data) return;
      setFormData((prev) => ({
        ...prev,
        fullName: data.full_name || prev.fullName,
        email: data.email || prev.email,
        phone: data.phone || prev.phone,
        address: data.address || prev.address,
        city: data.city || prev.city,
        province: data.province || prev.province,
      }));
    };
    prefill();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerSchema.safeParse(formData).success) {
      alert("Please fill in your name, phone number, and delivery address.");
      return;
    }
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prices and totals are computed server-side by the place_order DB function.
      const order = await apiRequest<PlacedOrderResponse>("/api/v1/checkout", {
        method: "POST",
        json: { ...formData, items: items.map((item) => ({ id: item.book.id, quantity: item.quantity })) },
      });

      setCompletedOrder({
        orderId: order.order_number,
        items: [...items],
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping_fee),
        total: Number(order.total_amount),
        customer: { ...formData },
        placedAt: new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      });
      clearCart();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { items, subtotal, shipping, total, formData, setField, isSubmitting, completedOrder, submit };
}
