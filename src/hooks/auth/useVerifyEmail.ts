import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-hot-toast";
import { verifyEmail } from "../../services/auth/auth.service";
import type { VerifyForm } from "../../validations/auth/verify";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyForm) => verifyEmail(data.email),
    onSuccess: () => {
      toast.success(
        "Verification email has been sent to your registered email.",
      );
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to send verification email.";
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};
