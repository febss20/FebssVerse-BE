import { z } from "zod";

export const createExperienceSchema = z.object({
  body: z.object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    location: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().default(false),
    type: z
      .enum(["WORK", "EDUCATION", "ORGANIZATION", "VOLUNTEER"])
      .default("WORK"),
    order: z.number().int().default(0),
  }),
});

export const updateExperienceSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    company: z.string().min(1).optional(),
    position: z.string().min(1).optional(),
    location: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    startDate: z.string().optional(),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().optional(),
    type: z.enum(["WORK", "EDUCATION", "ORGANIZATION", "VOLUNTEER"]).optional(),
    order: z.number().int().optional(),
  }),
});

export type CreateExperienceInput = z.infer<
  typeof createExperienceSchema
>["body"];
export type UpdateExperienceInput = z.infer<
  typeof updateExperienceSchema
>["body"];
