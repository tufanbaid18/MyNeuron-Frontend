import { useQuery } from "@tanstack/react-query";
import { getFeedPosts, getNews } from "../../services/impulse/impulse.service";

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
