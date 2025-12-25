import { z } from "zod";

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    proficiency: z.number().int().min(0).max(100).default(50),
    categoryId: z.string().uuid().optional().nullable(),
    order: z.number().int().default(0),
  }),
});

export const updateSkillSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    proficiency: z.number().int().min(0).max(100).optional(),
    categoryId: z.string().uuid().optional().nullable(),
    order: z.number().int().optional(),
  }),
});

export const createSkillCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    order: z.number().int().default(0),
  }),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>["body"];
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>["body"];
