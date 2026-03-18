import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { resetPassword } from "../../services/auth/auth.service";
import type { ResetPasswordPayload } from "../../types/auth/login.types";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    onSuccess: (result) => {
      toast.success(result || "Password has been reset successfully.");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (
          error.status === 400 &&
          error.response?.data.detail === "Invalid token."
        ) {
          toast.error("Token expired. Please request a new reset link.");
          return;
        }
        const message =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to send reset link.";
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};
