import { useMutation } from "@tanstack/react-query";
import { createPost } from "../../services/impulse/impulse.service";
import type { CreatePostPayload } from "../../types/impulse/post.types";

export const useCreatePost = (
  options?: Parameters<typeof useMutation<unknown, unknown, CreatePostPayload>>[0],
) => {
  return useMutation({
    mutationFn: createPost,
    ...options,
  });
};
