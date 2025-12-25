import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().optional(),
    content: z.string().optional(),
    thumbnailUrl: z.string().url().optional().nullable(),
    demoUrl: z.string().url().optional().nullable(),
    repoUrl: z.string().url().optional().nullable(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    featured: z.boolean().default(false),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    technologies: z.array(z.string()).optional(),
    images: z
      .array(
        z.object({
          url: z.string().url(),
          altText: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    thumbnailUrl: z.string().url().optional().nullable(),
    demoUrl: z.string().url().optional().nullable(),
    repoUrl: z.string().url().optional().nullable(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    featured: z.boolean().optional(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    order: z.number().int().optional(),
    technologies: z.array(z.string()).optional(),
  }),
});

export const reorderProjectsSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string().uuid(),
        order: z.number().int(),
      })
    ),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];
