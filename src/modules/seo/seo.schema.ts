import { z } from "zod";

export const updateSeoSchema = z.object({
  params: z.object({
    pageKey: z.string().min(1),
  }),
  body: z.object({
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    ogImage: z.string().url().optional().nullable(),
    structuredData: z.any().optional().nullable(),
  }),
});

export type UpdateSeoInput = z.infer<typeof updateSeoSchema>["body"];
