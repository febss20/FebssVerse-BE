import { z } from "zod";

export const uploadSchema = z.object({
  body: z.object({
    folder: z.string().optional(),
  }),
});

export type UploadInput = z.infer<typeof uploadSchema>["body"];
