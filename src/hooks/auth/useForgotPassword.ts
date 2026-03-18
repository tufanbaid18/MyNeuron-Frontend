import { useMutation } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { APP_ROUTES } from "../../constants/app.routes";
import { forgotPassword } from "../../services/auth/auth.service";
import type { EmailForm } from "../../validations/auth/verify";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: EmailForm) => forgotPassword(data.email),
    onSuccess: () => {
      toast.success("Reset link has been sent to your registered email.");
      Navigate({ to: APP_ROUTES.LOGIN });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
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
