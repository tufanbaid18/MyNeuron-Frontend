import { z } from "zod";

export const verifySchema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .toLowerCase()
    .max(200, "Maximum 200 character"),
});

export type VerifyForm = z.infer<typeof verifySchema>;
