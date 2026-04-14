import { API_ROUTES } from "../../constants/api.routes";
import axiosInstance from "../../lib/axiosInstance";
import type { MyActivityOverview } from "../../types/impulse/feed.types";
import type { PagesOverview } from "../../types/impulse/page.types";
import type {
  FeedPost,
  OgMetaResponse,
  UpdatePostPayload,
} from "../../types/impulse/post.types";

export const getFeedPosts = async (): Promise<FeedPost[]> => {
  const response = await axiosInstance.get<FeedPost[]>(API_ROUTES.POSTS);
  return response.data;
};

export const createPost = async ({
  title,
  content,
  files = [],
}: {
  title?: string;
  content: string;
  files?: File[];
}) => {
  const formData = new FormData();
  formData.append("title", title ?? "");
  formData.append("content", content);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post(API_ROUTES.POSTS, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const updatePost = async ({
  postId,
  title,
  content,
  files = [],
}: UpdatePostPayload) => {
  const formData = new FormData();

  if (title !== undefined) formData.append("title", title);
  if (content !== undefined) formData.append("content", content);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.patch(
    API_ROUTES.POST_BY_ID(postId),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data;
};

export const getOgiMeta = async (url: string): Promise<OgMetaResponse> => {
  const response = await axiosInstance.post<OgMetaResponse>(
    API_ROUTES.OG_META,
    {
      url,
    },
  );
  return response.data;
};

export const getMyActivityOverview = async (): Promise<MyActivityOverview> => {
  const response = await axiosInstance.get<MyActivityOverview>(
    API_ROUTES.MY_ACTIVITY_OVERVIEW,
  );
  return response.data;
};

export const getPagesOverview = async (): Promise<PagesOverview> => {
  const response = await axiosInstance.get<PagesOverview>(
    API_ROUTES.PAGES_OVERVIEW,
  );
  return response.data;
};
