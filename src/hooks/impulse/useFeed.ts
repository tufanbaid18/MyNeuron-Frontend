import { useQuery } from "@tanstack/react-query";
import {
  getFeedPosts,
  getNews,
  getPostDetails,
} from "../../services/impulse/impulse.service";

export const useFeedPosts = () => {
  return useQuery({
    queryKey: ["get-feed-posts"],
    queryFn: getFeedPosts,
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
  });
};
