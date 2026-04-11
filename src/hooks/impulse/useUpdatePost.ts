import { useMutation } from "@tanstack/react-query";
import { updatePost } from "../../services/impulse/impulse.service";
import type { UpdatePostPayload } from "../../types/impulse/post.types";

export const useUpdatePost = (
  options?: Parameters<typeof useMutation<unknown, unknown, UpdatePostPayload>>[0],
) => {
  return useMutation({
    mutationFn: updatePost,
    ...options,
  });
};
