import z from "zod";

export const passwordValidation = z
  .string()
  .trim()
  .min(8, "Password must be atleast 8 characters")
  .max(16, "Password must be less than 16 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/,
    "Password must include uppercase, lowercase, number, and special character",
  );

export const resetPasswordSchema = z
  .object({
    confirm_password: passwordValidation,
    new_password: passwordValidation,
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
