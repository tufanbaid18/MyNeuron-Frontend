export type PostUser = {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string | null;
};

export type PostMedia = {
  id: number;
  file_url: string;
  file_type: string;
};

export type PostData = {
  id: number;
  title: string | null;
  content: string | null;
  media: PostMedia[];
  user: PostUser;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  created_at: string;
};

export interface CreatePostPayload {
  title?: string;
  content: string;
  files?: File[];
}

export interface UpdatePostPayload extends CreatePostPayload {
  postId: number;
}

export interface OgMetaResponse {
  url: string;
  og: {
    "og:title"?: string;
    "og:description"?: string;
    "og:image"?: string;
    "og:site_name"?: string;
  };
}

export type FeedPosts = FeedPost[];

export type FeedPost = {
  id: number;
  type: "user_post" | "page_post";
  data: {
    id: number;
    page_details: PostPageDetails | null;
    created_by: FeedPagePostCreatedBy | null;
    user: FeedPostUser;
    title: string;
    content: string;
    media: FeedPostMedia[];
    link_preview: FeedLinkPreview | null;
    created_at: string;
    like_count: number;
    bookmark_count: number;
    comment_count: number;
    is_liked: boolean;
    is_bookmarked: boolean;
    comments: FeedPostComment[];
  };
  created_at: string;
};

export type FeedPostMedia = {
  id: number;
  file_url: string;
  is_video: boolean;
};

export type FeedPostUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image_url: string | null;
  is_following: boolean;
};

export type FeedLinkPreview = {
  type: string;
  video_id: string;
  embed_url: string;
  thumbnail: string;
  watch_url: string;
};

export type FeedPostComment = {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image_url: string | null;
    is_following: boolean;
  };
  c_content: string;
  created_at: string;
};

export type PostPageDetails = {
  id: number;
  page_name: string;
  category: string;
  profile_image: string;
};

export type FeedPagePostCreatedBy = {
  id: 1;
  first_name: string;
  last_name: string;
  email: string;
  profile_image_url: string | null;
  is_following: boolean;
};
