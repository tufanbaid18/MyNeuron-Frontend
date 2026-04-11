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
