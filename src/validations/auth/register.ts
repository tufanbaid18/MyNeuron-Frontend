import { z } from "zod";

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
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters")
      .max(16, "Password must be atmost 16 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirm_password: z
      .string()
      .min(8, "Password must be atleast 8 characters")
      .max(16, "Password must be atmost 16 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterForm = z.infer<typeof registerSchema>;
