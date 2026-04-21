import { appStore, userProfileAtom } from "../../store/auth.store";
import { API_ROUTES } from "../../constants/api.routes";
import { queryClient } from "../../lib/queryClient";
import axiosInstance from "../../lib/axiosInstance";
import type {
  LoginRequest,
  ResetPasswordPayload,
} from "../../types/auth/login.types";
import type { UserProfile } from "../../types/user/user.types";
import type { RegisterForm } from "../../validations/auth/register";

export const loginUser = async (data: LoginRequest): Promise<void> => {
  await axiosInstance.post(API_ROUTES.LOGIN, data);
  // Tokens are set in cookies by the server automatically
};

export const registerUser = async (data: RegisterForm): Promise<void> => {
  await axiosInstance.post(API_ROUTES.REGISTER, data);
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get<UserProfile>(
    API_ROUTES.USER_PROFILE,
  );
  return response.data;
};

export const refreshToken = async (): Promise<void> => {
  await axiosInstance.post(API_ROUTES.REFRESH_TOKEN);
};

export const verifyEmail = async (token: string): Promise<string> => {
  const response = await axiosInstance.post(API_ROUTES.VERIFY_EMAIL, { token });
  return response.data;
};

export const resendVerificationEmail = async (
  email: string,
): Promise<string> => {
  const response = await axiosInstance.post(API_ROUTES.RESEND_EMAIL, { email });
  return response.data;
};

export const forgotPassword = async (
  email: string,
): Promise<{ detail: string }> => {
  const response = await axiosInstance.post(API_ROUTES.FORGOT_PASSWORD, {
    email,
  });
  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordPayload,
): Promise<string> => {
  const response = await axiosInstance.post(API_ROUTES.RESET_PASSWORD, data);
  return response.data;
};

export const updateUserProfile = async (
  data: Partial<UserProfile>,
): Promise<UserProfile> => {
  const response = await axiosInstance.patch<UserProfile>(
    API_ROUTES.UPDATE_USER_PROFILE,
    data,
  );
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post(API_ROUTES.LOGOUT);
  queryClient.clear();
  appStore.set(userProfileAtom, null);
};
