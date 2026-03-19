import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "../../services/user/user.service";

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      // Update user-profile cache
      queryClient.setQueryData(["userProfile"], (old: import("../../types/user/user.types").UserProfile | undefined) => {
        if (!old) return old;
        return {
          ...old,
          profile_image: data.profile_image,
        };
      });
    },
  });
};
