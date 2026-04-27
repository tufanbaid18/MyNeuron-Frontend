import { useQuery } from "@tanstack/react-query";
import {
  getFeedPosts,
  getNews,
  getPostDetails,
} from "../../services/impulse/impulse.service";
import type { FeedPostType } from "../../types/impulse/feed.types";

export const useFeedPosts = (pageId?: number) => {
  return useQuery({
    queryKey: ["get-feed-posts", pageId],
    queryFn: () => getFeedPosts(pageId),
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });
};

export const useNews = () => {
  return useQuery({
    queryKey: ["get-news"],
    queryFn: getNews,
  });
};

export const usePostDetails = (postId: number, post_type: FeedPostType) => {
  return useQuery({
    queryKey: ["get-post-details", postId, post_type],
    queryFn: () => getPostDetails(postId, post_type),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
