import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "../../services/auth/auth.service";
import type { UserProfile } from "../../types/user/user.types";

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

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => updateUserProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, data);
    },
  });
};

