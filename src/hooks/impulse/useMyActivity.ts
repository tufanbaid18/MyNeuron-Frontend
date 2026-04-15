import { useQuery } from "@tanstack/react-query";
import { getMyActivityOverview } from "../../services/impulse/impulse.service";

export const useMyActivityOverview = () => {
  return useQuery({
    queryKey: ["my-activity-overview"],
    queryFn: getMyActivityOverview,
  });
};
