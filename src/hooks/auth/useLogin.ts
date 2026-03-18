import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { APP_ROUTES } from "../../constants/app.routes";
import { getUserProfile, loginUser } from "../../services/auth/auth.service";
import { userProfileAtom } from "../../store/auth.store";
import type { LoginRequest } from "../../types/auth/login.types";

export const useLogin = () => {
  const setUserProfile = useSetAtom(userProfileAtom);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        toast.success("Logged in successfully");
        navigate({ to: APP_ROUTES.LOGIN });
      } catch {
        toast.error("Login succeeded but failed to fetch profile.");
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 403) {
          toast.error("Account is not activated. Please verify your email.");
          navigate({ to: APP_ROUTES.RESEND_EMAIL });
          return;
        }

        const message =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Login failed. Please check your credentials.";
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};
