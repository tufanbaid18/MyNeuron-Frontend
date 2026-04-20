import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePage,
  followPage,
  getAllPagesByFilter,
  getPagesOverview,
  pageDetails,
  unfollowPage,
  updatePage,
} from "../../services/impulse/impulse.service";
import type {
  CreatePagePayload,
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

export const useFollowPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pageId: number) => followPage(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages-by-filter"] });
      queryClient.invalidateQueries({ queryKey: ["pages-overview"] });
    },
  });
};

export const useUnfollowPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pageId: number) => unfollowPage(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages-by-filter"] });
      queryClient.invalidateQueries({ queryKey: ["pages-overview"] });
    },
  });
};

export const usePageDetails = (pageId: number) => {
  return useQuery({
    queryKey: ["page-details", pageId],
    queryFn: () => pageDetails(pageId),
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      pageId,
      payload,
    }: {
      pageId: number;
      payload: Partial<CreatePagePayload>;
    }) => updatePage(pageId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["page-details", variables.pageId],
      });
      queryClient.invalidateQueries({ queryKey: ["pages-by-filter"] });
      queryClient.invalidateQueries({ queryKey: ["pages-overview"] });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pageId: number) => deletePage(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages-by-filter"] });
      queryClient.invalidateQueries({ queryKey: ["pages-overview"] });
    },
  });
};
