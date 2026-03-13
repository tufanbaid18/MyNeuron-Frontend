import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/auth/auth.service";

export const USER_PROFILE_QUERY_KEY = ["userProfile"] as const;

export const useUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: getUserProfile,
    enabled,
    retry: false, // Don't retry — the interceptor already handles 401 refresh
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
