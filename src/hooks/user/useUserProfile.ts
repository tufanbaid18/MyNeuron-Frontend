import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "../../services/user/user.service";

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      // Update user-profile cache
      queryClient.setQueryData(["user-profile"], (old: any) => ({
        ...old,
        profile_image: data.profile_image,
      }));
    },
  });
};
