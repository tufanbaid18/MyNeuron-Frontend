import { Card, Modal } from "antd";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddComment } from "../../hooks/impulse/useAddComment";
import { useBookmarkPost } from "../../hooks/impulse/useBookmarkPost";
import { useDeletePost } from "../../hooks/impulse/useDeletePost";
import { useLikePost } from "../../hooks/impulse/useLikePost";
import type { FeedPost } from "../../types/impulse/post.types";
import CreatePostComponent from "./CreatePostComponent";
import { PostComments } from "./post";
import {
  LinkPreview,
  OgPreview,
  PostActions,
  PostContent,
  PostHeader,
  PostMedia,
  PostStats,
} from "./post";
import { APP_ROUTES } from "../../constants/app.routes";
import { SharePostModal } from "../inbox/SharePostModal";

interface PostCardProps {
  post: FeedPost;
  userId: number;
  onNewPost?: () => void;
}

export const PostCard = ({ post, userId, onNewPost }: PostCardProps) => {
  const queryClient = useQueryClient();
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

  const isOwnPost = isUserPost && data.user.id === userId;

  const [editOpen, setEditOpen] = useState(false);
  const [editingPostData, setEditingPostData] = useState<{
    id: number;
    title: string;
    content: string;
    media: { file_url: string; is_video: boolean }[];
    link_preview?: {
      type?: string;
      embed_url?: string;
      video_id?: string;
      watch_url?: string;
    } | null;
  } | null>(null);

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const likePost = useLikePost();
  const bookmarkPost = useBookmarkPost();
  const addComment = useAddComment();
  const deletePost = useDeletePost();

  const handleLike = useCallback(() => {
    likePost.mutate(post.id);
  }, [likePost, post.id]);

  const handleComment = useCallback(() => {
    setShowCommentForm((prev) => !prev);
  }, []);

  const handleBookmark = useCallback(() => {
    bookmarkPost.mutate(post.id);
  }, [bookmarkPost, post.id]);

  const postUrl = `${window.location.origin}${APP_ROUTES.IMPULSE_POST(post.id)}`;

  const handleShare = useCallback(() => {
    setShareModalOpen(true);
  }, []);

  const handleAddComment = useCallback(
    (content: string) => {
      addComment.mutate(
        { postId: post.id, content },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-feed-posts"] });
            queryClient.invalidateQueries({
              queryKey: ["get-post-details", post.id],
            });
          },
        },
      );
    },
    [addComment, post.id, queryClient],
  );

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: "Delete post",
      content: "Are you sure you want to delete this post?",
      okText: "Delete",
      okType: "danger",
      onOk: () => deletePost.mutate(post.id),
    });
  }, [deletePost, post.id]);

  const handleEdit = useCallback(() => {
    setEditingPostData({
      id: post.id,
      title: data.title || "",
      content: data.content || "",
      media: data.media || [],
      link_preview: data.link_preview,
    });
    setEditOpen(true);
  }, [post.id, data]);

  const handleEditSuccess = useCallback(() => {
    setEditOpen(false);
    setEditingPostData(null);
    onNewPost?.();
  }, [onNewPost]);

  return (
    <>
      <Card
        style={{ width: "100%", overflow: "hidden" }}
        styles={{ body: { padding: 0 } }}
        data-post-id={post.id}
      >
        <PostHeader
          author={author}
          displayName={displayName}
          subtitle={subtitle}
          isUserPost={isUserPost}
          createdAt={data.created_at}
          isOwnPost={isOwnPost}
          onEdit={isOwnPost ? handleEdit : undefined}
          onDelete={isOwnPost ? handleDelete : undefined}
        />

        <PostContent
          title={data.title}
          content={data.content}
          renderExtra={
            <OgPreview
              content={data.content || ""}
              hasLinkPreview={!!data.link_preview}
            />
          }
        />

        {data.link_preview && <LinkPreview linkPreview={data.link_preview} />}

        <PostMedia media={data.media} />

        <PostStats
          postId={post.id}
          likeCount={data.like_count}
          commentCount={data.comment_count}
          isLiked={data.is_liked}
        />

        <PostActions
          isLiked={data.is_liked}
          isBookmarked={data.is_bookmarked}
          isLoading={likePost.isPending || bookmarkPost.isPending}
          onLike={handleLike}
          onComment={handleComment}
          onBookmark={handleBookmark}
          onShare={handleShare}
        />

        {showCommentForm && (
          <PostComments
            comments={[]}
            postId={post.id}
            userId={userId}
            onAddComment={handleAddComment}
            isAddingComment={addComment.isPending}
            showFormOnly
          />
        )}
      </Card>

      <SharePostModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        postUrl={postUrl}
        postTitle={data.title || data.content?.slice(0, 60) || "Impulse Post"}
      />

      {editOpen && editingPostData && (
        <CreatePostComponent
          open={editOpen}
          onOpen={() => setEditOpen(true)}
          onClose={() => setEditOpen(false)}
          onSuccess={handleEditSuccess}
          editingPost={editingPostData}
          user={{
            id: userId,
            email: author.email,
            first_name: author.first_name,
            last_name: author.last_name,
            middle_name: "",
            title: null,
            profile_title: null,
            profile_image: author.profile_image_url,
            personal_detail: null,
            professional_detail: null,
            education: [],
            scientific_interest: null,
            followers_count: 0,
            following_count: 0,
            is_following: false,
            follow_request_status: "none",
            is_verified: false,
            registered_events: [],
          }}
        />
      )}
    </>
  );
};

export default PostCard;
