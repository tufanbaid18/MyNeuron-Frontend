import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { APP_ROUTES } from "../../constants/app.routes";
import { registerUser } from "../../services/auth/auth.service";
import type { RegisterForm } from "../../validations/auth/register";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterForm) => registerUser(data),
    onSuccess: async () => {
      toast.success(
        "User registered! Verification Link is sent on the registered email verify to login!s",
      );
      navigate({ to: APP_ROUTES.ROOT });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          error.response?.data?.detail ??
          error.response?.data?.email ??
          "Registration failed. Please check details.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
