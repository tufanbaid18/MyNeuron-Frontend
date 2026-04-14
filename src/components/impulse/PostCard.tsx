import { Card } from "antd";
import type { FeedPost } from "../../types/impulse/post.types";
import {
  PostHeader,
  PostContent,
  PostMedia,
  PostStats,
  PostActions,
  PostComments,
  LinkPreview,
  OgPreview,
} from "./post";

interface PostCardProps {
  post: FeedPost;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onBookmark?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

export const PostCard = ({
  post,
  onLike,
  onComment,
  onBookmark,
  onShare,
}: PostCardProps) => {
  const { type, data } = post;
  const isUserPost = type === "user_post";

  const author = isUserPost
    ? data.user
    : {
        id: data.page_details?.id || 0,
        first_name: data.page_details?.page_name || "Page",
        last_name: "",
        profile_image_url: data.page_details?.profile_image || null,
        is_following: false,
        email: "",
      };

  const displayName = isUserPost
    ? `${data.user.first_name} ${data.user.last_name}`
    : data.page_details?.page_name || "Page";

  const subtitle = isUserPost
    ? data.user.email
    : data.page_details?.category || "Page";

  return (
    <Card className="mb-4" styles={{ body: { padding: 0 } }}>
      <PostHeader
        author={author}
        displayName={displayName}
        subtitle={subtitle}
        isUserPost={isUserPost}
        createdAt={data.created_at}
      />

      <PostContent
        title={data.title}
        content={data.content}
        renderExtra={<OgPreview content={data.content || ""} hasLinkPreview={!!data.link_preview} />}
      />

      {data.link_preview && <LinkPreview linkPreview={data.link_preview} />}

      <PostMedia media={data.media} />

      <PostStats
        likeCount={data.like_count}
        commentCount={data.comment_count}
        bookmarkCount={data.bookmark_count}
      />

      <PostActions
        isLiked={data.is_liked}
        isBookmarked={data.is_bookmarked}
        onLike={() => onLike?.(post.id)}
        onComment={() => onComment?.(post.id)}
        onBookmark={() => onBookmark?.(post.id)}
        onShare={() => onShare?.(post.id)}
      />

      <PostComments comments={data.comments || []} />
    </Card>
  );
};

export default PostCard;
