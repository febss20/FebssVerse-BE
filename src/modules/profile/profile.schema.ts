import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    title: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    avatarUrl: z.string().url().optional().nullable(),
    resumeUrl: z.string().url().optional().nullable(),
    location: z.string().optional().nullable(),
    socialLinks: z.record(z.string()).optional().nullable(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
