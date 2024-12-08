import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Title is required"),
  publishedAt: z.string().optional(),
  categories: z.any(),
  bodyText: z.string().min(20, "Body Text is required"),
  mainImage: z.any().optional(),
});

export type PostSchemaType = z.infer<typeof postSchema>;
