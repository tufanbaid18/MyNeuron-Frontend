import { useQuery } from "@tanstack/react-query";
import {
  getAllPagesByFilter,
  getPagesOverview,
} from "../../services/impulse/impulse.service";
import type {
  PageCategory,
  PageOverviewTypes,
} from "../../types/impulse/page.types";

export const usePagesOverview = () => {
  return useQuery({
    queryKey: ["pages-overview"],
    queryFn: getPagesOverview,
  });
};

export const usePagesByFilter = (params: {
  category?: PageCategory;
  type?: PageOverviewTypes;
}) => {
  return useQuery({
    queryKey: ["pages-by-filter", params],
    queryFn: () => getAllPagesByFilter(params),
  });
};
