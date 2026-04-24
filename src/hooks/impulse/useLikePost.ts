import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../../services/impulse/impulse.service";
import { FeedPostType } from "../../types/impulse/feed.types";
import type { FeedPost } from "../../types/impulse/post.types";

export const FEED_QUERY_KEY = ["get-feed-posts"] as const;

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({postId, post_type}: {postId: number, post_type: FeedPostType})=>likePost(postId, post_type),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        { queryKey: FEED_QUERY_KEY },
        (old: FeedPost[] | undefined) =>
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
