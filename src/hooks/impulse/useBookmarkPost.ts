import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkPost } from "../../services/impulse/impulse.service";
import type { FeedPost } from "../../types/impulse/post.types";
import type { FeedPostType } from "../../types/impulse/feed.types";

export const FEED_QUERY_KEY = ["get-feed-posts"] as const;

export const useBookmarkPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({postId, post_type}: {postId: number, post_type: FeedPostType})=>bookmarkPost(postId, post_type),
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: FEED_QUERY_KEY }, (old: FeedPost[] | undefined) =>
        old?.map((post) =>
          post.id === data.id
            ? {
                ...post,
                data: {
                  ...post.data,
                  is_bookmarked: data.is_bookmarked,
                  bookmark_count: data.bookmark_count,
                },
              }
            : post,
        ),
      );
    },
  });
};
