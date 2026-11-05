import { z } from "zod";

// Shared by the checkout form (client) and the /api/v1/checkout route (server).
// Prices, availability and shipping are computed by the place_order Postgres function;
// the client only supplies what the customer chose: book ids and quantities.
export const customerSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(30),
  email: z.string().trim().max(200).optional(),
  province: z.string().trim().min(1).max(80),
  city: z.string().trim().min(1).max(80),
  address: z.string().trim().min(1).max(300),
  notes: z.string().trim().max(500).optional(),
  paymentMethod: z.enum(["cod", "qr"]),
});

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = customerSchema.extend({
  items: z.array(orderItemSchema).min(1).max(100),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
