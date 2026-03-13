import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { getUserProfile, loginUser } from "../../services/auth/auth.service";
import { userProfileAtom } from "../../store/auth.store";
import type { LoginRequest } from "../../types/auth/login.types";
import { isAxiosError } from "axios";

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
        navigate({ to: "/" });
      } catch {
        toast.error("Login succeeded but failed to fetch profile");
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          error.response?.data?.detail ??
          "Login failed. Please check your credentials.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
