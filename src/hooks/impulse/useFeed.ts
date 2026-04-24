import { useQuery } from "@tanstack/react-query";
import {
  getFeedPosts,
  getNews,
  
  getPostDetails,
} from "../../services/impulse/impulse.service";

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

export const usePostDetails = (postId: number) => {
  return useQuery({
    queryKey: ["get-post-details", postId],
    queryFn: () => getPostDetails(postId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
