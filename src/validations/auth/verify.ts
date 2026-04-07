import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .toLowerCase()
    .max(200, "Maximum 200 character"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type EmailForm = z.infer<typeof emailSchema>;
export type VerifyEmailByToken = z.infer<typeof verifyEmailSchema>;
