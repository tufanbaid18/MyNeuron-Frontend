import { API_ROUTES } from "../../constants/api.routes";
import axiosInstance from "../../lib/axiosInstance";
import type {
  FeedPostType,
  MyActivityOverview,
} from "../../types/impulse/feed.types";
import type {
  CreatePagePayload,
  PageCategory,
  PageDetails,
  PageOverviewTypes,
  PagesByFilterResponse,
  PagesOverview,
} from "../../types/impulse/page.types";
import type {
  FeedPost,
  OgMetaResponse,
  UpdatePostPayload,
} from "../../types/impulse/post.types";

export const getFeedPosts = async (pageId?: number): Promise<FeedPost[]> => {
  let response;
  if (pageId) {
    response = await axiosInstance.get<FeedPost[]>(API_ROUTES.POSTS, {
      params: {
        pageId: pageId,
      },
    });
  } else {
    response = await axiosInstance.get<FeedPost[]>(API_ROUTES.POSTS);
  }
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

export const createPage = async (payload: CreatePagePayload) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value === "" || value === undefined || value === null) continue;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) continue;
      // Tags: append each item individually so backend receives a list
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, String(value));
    }
  }

  const response = await axiosInstance.post(API_ROUTES.PAGES, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updatePage = async (
  pageId: number,
  payload: Partial<CreatePagePayload>,
) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value === "" || value === undefined || value === null) continue;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) continue;
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, String(value));
    }
  }

  const response = await axiosInstance.patch(
    API_ROUTES.PAGE_DETAILS(pageId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const deletePage = async (pageId: number) => {
  await axiosInstance.delete(API_ROUTES.PAGE_DETAILS(pageId));
};

export const likePost = async (postId: number, post_type: FeedPostType) => {
  const response = await axiosInstance.post<{
    id: number;
    is_liked: boolean;
    like_count: number;
  }>(API_ROUTES.POST_LIKE(postId), { post_type });
  return response.data;
};

export const bookmarkPost = async (postId: number, post_type: FeedPostType) => {
  const response = await axiosInstance.post<{
    id: number;
    is_bookmarked: boolean;
    bookmark_count: number;
  }>(API_ROUTES.POST_BOOKMARK(postId), { post_type });
  return response.data;
};

export const addComment = async (
  postId: number,
  content: string,
  post_type: FeedPostType,
) => {
  const response = await axiosInstance.post<{
    id: number;
    c_content: string;
    created_at: string;
  }>(API_ROUTES.POST_COMMENT(postId), { c_content: content, post_type });
  return response.data;
};

export const deletePost = async (postId: number) => {
  await axiosInstance.delete(API_ROUTES.POST_BY_ID(postId));
};

export const getNews = async () => {
  const response = await axiosInstance.get(API_ROUTES.NEWS);
  return response.data;
};

export const getPostDetails = async (
  postId: number,
  post_type: FeedPostType,
) => {
  const response = await axiosInstance.get(API_ROUTES.POST_BY_ID(postId), {
    params: { post_type },
  });
  return response.data;
};

export const getAllPagesByFilter = async (params: {
  category?: PageCategory;
  type?: PageOverviewTypes;
}): Promise<PagesByFilterResponse> => {
  const response = await axiosInstance.get<PagesByFilterResponse>(
    API_ROUTES.PAGES_BY_FILTER,
    {
      params,
    },
  );
  return response.data;
};

export const pageDetails = async (pageId: number): Promise<PageDetails> => {
  const response = await axiosInstance.get<PageDetails>(
    API_ROUTES.PAGE_DETAILS(pageId),
  );
  return response.data;
};

export const followPage = async (pageId: number) => {
  const response = await axiosInstance.post(API_ROUTES.PAGE_FOLLOW, {
    page: pageId,
  });
  return response.data;
};

export const unfollowPage = async (pageId: number) => {
  const response = await axiosInstance.post(API_ROUTES.PAGE_UNFOLLOW, {
    page: pageId,
  });
  return response.data;
};

export const createPagePost = async ({
  pageId,
  title,
  content,
  files = [],
}: {
  pageId: number;
  title?: string;
  content: string;
  files?: File[];
}) => {
  const formData = new FormData();
  formData.append("page", String(pageId));
  if (title) formData.append("title", title);
  formData.append("content", content);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post(API_ROUTES.PAGE_POSTS, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
