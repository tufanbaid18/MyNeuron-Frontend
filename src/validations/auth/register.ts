import { z } from "zod";

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[^\s]+$/,
    "Password must include uppercase, lowercase, number, and special character",
  );

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "At least 2 characters expected")
      .max(50, "Maximum 50 character")
      .trim(),
    middle_name: z.string().optional(),
    last_name: z
      .string()
      .min(2, "At least 2 characters expected")
      .max(50, "Maximum 50 character")
      .trim(),
    email: z
      .string()
      .email()
      .trim()
      .max(200, "Maximum 200 character")
      .toLowerCase(),
    password: passwordValidation,
    confirm_password: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterForm = z.infer<typeof registerSchema>;
