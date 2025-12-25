import { z } from "zod";

export const createArticleSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    coverImage: z.string().url().optional().nullable(),
    categoryId: z.string().uuid().optional().nullable(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateArticleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    excerpt: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    coverImage: z.string().url().optional().nullable(),
    categoryId: z.string().uuid().optional().nullable(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const getArticlesSchema = z.object({
  query: z.object({
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    featured: z.string().optional(),
    category: z.string().optional(),
    tag: z.string().optional(),
    limit: z.string().optional(),
    offset: z.string().optional(),
  }),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>["body"];
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>["body"];
