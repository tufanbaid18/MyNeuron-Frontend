import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-hot-toast";
import {
  resendVerificationEmail,
  verifyEmail,
} from "../../services/auth/auth.service";
import type {
  EmailForm,
  VerifyEmailByToken,
} from "../../validations/auth/verify";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailByToken) => verifyEmail(data.token),
    onSuccess: () => {
      toast.success("Email verified successfully! You can now log in.");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to verify email.";
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};

export const useVerifyEmailQuery = (token?: string) => {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token!),
    enabled: !!token,
    staleTime: Infinity, // Important: Never re-verify the same token
    retry: false,
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: (data: EmailForm) => resendVerificationEmail(data.email),
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
