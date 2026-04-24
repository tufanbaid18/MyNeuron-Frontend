import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../services/impulse/impulse.service";
import type { FeedPost } from "../../types/impulse/post.types";

export const FEED_QUERY_KEY = ["get-feed-posts"] as const;

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, postId) => {
      queryClient.setQueriesData({ queryKey: FEED_QUERY_KEY }, (old: FeedPost[] | undefined) =>
        old?.filter((post) => post.id !== postId),
      );
    },
  });
};
