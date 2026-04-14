import { useQuery } from "@tanstack/react-query";
import { getFeedPosts } from "../../services/impulse/impulse.service";

export const useFeedPosts = () => {
  return useQuery({
    queryKey: ["get-feed-posts"],
    queryFn: getFeedPosts,
  });
};
