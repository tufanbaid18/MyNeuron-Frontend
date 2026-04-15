import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../../services/impulse/impulse.service";
import type { FeedPost } from "../../types/impulse/post.types";

export const FEED_QUERY_KEY = ["get-feed-posts"] as const;

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onSuccess: (data) => {
      queryClient.setQueryData<FeedPost[]>(FEED_QUERY_KEY, (old) =>
        old?.map((post) =>
          post.id === data.id
            ? {
                ...post,
                data: {
                  ...post.data,
                  is_liked: data.is_liked,
                  like_count: data.like_count,
                },
              }
            : post,
        ),
      );
    },
  });
};
