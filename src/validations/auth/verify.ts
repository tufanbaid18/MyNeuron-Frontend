import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .toLowerCase()
    .max(200, "Maximum 200 character"),
});

export type EmailForm = z.infer<typeof emailSchema>;
export type VerifyForm = z.infer<typeof emailSchema>;
