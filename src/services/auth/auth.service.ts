import { API_ROUTES } from "../../constants/api.routes";
import axiosInstance from "../../lib/axiosInstance";
import type { LoginRequest } from "../../types/auth/login.types";
import type { UserProfile } from "../../types/user/user.types";

export const loginUser = async (data: LoginRequest): Promise<void> => {
  await axiosInstance.post(API_ROUTES.LOGIN, data);
  // Tokens are set in cookies by the server automatically
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get<UserProfile>(API_ROUTES.USER_PROFILE);
  return response.data;
};

export const refreshToken = async (): Promise<void> => {
  await axiosInstance.post(API_ROUTES.REFRESH_TOKEN);
};
