import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  publicUserSearch,
  publicUserSearchById,
  uploadProfileImage,
} from "../../services/user/user.service";
import type { UserProfile } from "../../types/user/user.types";

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      // Update user-profile cache
      queryClient.setQueryData(
        ["userProfile"],
        (
          old: import("../../types/user/user.types").UserProfile | undefined,
        ) => {
          if (!old) return old;
          return {
            ...old,
            profile_image: data.profile_image,
          };
        },
      );
    },
  });
};

export const useUserSearch = (query: string) => {
  return useQuery<UserProfile[]>({
    queryKey: ["userSearch", query],
    queryFn: () => publicUserSearch(query),
    enabled: !!query,
    // staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserSearchById = (id: number) => {
  return useQuery<UserProfile>({
    queryKey: ["userSearchById", id],
    queryFn: () => publicUserSearchById(id),
    enabled: !!id,
    // staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
