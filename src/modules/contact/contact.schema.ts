import { z } from "zod";

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    subject: z.string().optional().nullable(),
    message: z.string().min(1, "Message is required"),
  }),
});

export type CreateContactInput = z.infer<typeof createContactSchema>["body"];
