import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(200).optional(),
  content: z.string().trim().min(1, "Please write a few words about the book").max(2000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
