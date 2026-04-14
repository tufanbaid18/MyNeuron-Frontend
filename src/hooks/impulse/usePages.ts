import { useQuery } from "@tanstack/react-query";
import { getPagesOverview } from "../../services/impulse/impulse.service";

export const usePagesOverview = () => {
  return useQuery({
    queryKey: ["pages-overview"],
    queryFn: getPagesOverview,
  });
};
