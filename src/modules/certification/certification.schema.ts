import { z } from "zod";

export const createCertificationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    issuer: z.string().min(1, "Issuer is required"),
    credentialId: z.string().optional().nullable(),
    credentialUrl: z.string().url().optional().nullable(),
    issueDate: z.string().min(1, "Issue date is required"),
    expiryDate: z.string().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
  }),
});

export const updateCertificationSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    issuer: z.string().min(1).optional(),
    credentialId: z.string().optional().nullable(),
    credentialUrl: z.string().url().optional().nullable(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
  }),
});

export type CreateCertificationInput = z.infer<
  typeof createCertificationSchema
>["body"];
export type UpdateCertificationInput = z.infer<
  typeof updateCertificationSchema
>["body"];
