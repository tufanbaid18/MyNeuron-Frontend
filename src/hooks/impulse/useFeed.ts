import { useQuery } from "@tanstack/react-query";
import {
  getFeedPosts,
  getNews,
  getPagePosts,
  getPostDetails,
} from "../../services/impulse/impulse.service";

export const useFeedPosts = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["get-feed-posts"],
    queryFn: getFeedPosts,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
    ...options,
  });
};

export const usePagePosts = (pageId: number) => {
  return useQuery({
    queryKey: ["get-page-posts", pageId],
    queryFn: () => getPagePosts(pageId),
    enabled: !!pageId,
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

export const usePostDetails = (postId: number) => {
  return useQuery({
    queryKey: ["get-post-details", postId],
    queryFn: () => getPostDetails(postId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
