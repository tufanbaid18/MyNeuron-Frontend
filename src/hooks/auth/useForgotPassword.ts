import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { APP_ROUTES } from "../../constants/app.routes";
import { forgotPassword } from "../../services/auth/auth.service";
import type { EmailForm } from "../../validations/auth/verify";

export const useForgotPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: EmailForm) => forgotPassword(data.email),
    onSuccess: (result) => {
      toast.success(
        result?.detail ??
          "If this email is registered, you will receive a reset link.",
      );
      navigate({ to: APP_ROUTES.LOGIN });
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
