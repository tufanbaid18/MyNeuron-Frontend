import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../../services/impulse/impulse.service";
import { useUserProfile } from "../auth/useUserProfile";
import type { FeedPost, FeedPostComment } from "../../types/impulse/post.types";

export const FEED_QUERY_KEY = ["get-feed-posts"] as const;

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUserProfile();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: number; content: string }) =>
      addComment(postId, content),
    onSuccess: (data, { postId }) => {
      if (!user) return;

      const newComment: FeedPostComment = {
        id: data.id,
        c_content: data.c_content,
        created_at: data.created_at,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          profile_image_url: user.profile_image,
          is_following: user.is_following,
        },
      };

      queryClient.setQueryData<FeedPost[]>(FEED_QUERY_KEY, (old) =>
        old?.map((post) =>
          post.id === postId
            ? {
                ...post,
                data: {
                  ...post.data,
                  comment_count: (post.data.comment_count || 0) + 1,
                  comments: [...(post.data.comments || []), newComment],
                },
              }
            : post,
        ),
      );
    },
  });
};
