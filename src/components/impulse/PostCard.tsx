import { useState, useCallback } from "react";
import { Card, message, Modal } from "antd";
import type { FeedPost } from "../../types/impulse/post.types";
import {
  PostHeader,
  PostContent,
  PostMedia,
  PostActions,
  LinkPreview,
  OgPreview,
} from "./post";
import { useLikePost } from "../../hooks/impulse/useLikePost";
import { useBookmarkPost } from "../../hooks/impulse/useBookmarkPost";
import { useAddComment } from "../../hooks/impulse/useAddComment";
import { useDeletePost } from "../../hooks/impulse/useDeletePost";
import CreatePostComponent from "./CreatePostComponent";

interface PostCardProps {
  post: FeedPost;
  userId: number;
  onNewPost?: () => void;
}

export const PostCard = ({
  post,
  userId,
  onNewPost,
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

  const isOwnPost = isUserPost && data.user.id === userId;

  const [editOpen, setEditOpen] = useState(false);
  const [editingPostData, setEditingPostData] = useState<{
    id: number;
    title: string;
    content: string;
    media: { file_url: string; is_video: boolean }[];
  } | null>(null);

  const likePost = useLikePost();
  const bookmarkPost = useBookmarkPost();
  const addComment = useAddComment();
  const deletePost = useDeletePost();

  const handleLike = useCallback(() => {
    likePost.mutate(post.id);
  }, [likePost, post.id]);

  const handleComment = useCallback(() => {
    // toggled inside PostActions
  }, []);

  const handleBookmark = useCallback(() => {
    bookmarkPost.mutate(post.id);
  }, [bookmarkPost, post.id]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/posts/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      message.success("Link copied to clipboard");
    });
  }, [post.id]);

  const handleAddComment = useCallback(
    (content: string) => {
      addComment.mutate({ postId: post.id, content });
    },
    [addComment, post.id],
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
        className="w-full!"
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

        <PostActions
          isLiked={data.is_liked}
          isBookmarked={data.is_bookmarked}
          isLoading={likePost.isPending || bookmarkPost.isPending}
          likeCount={data.like_count}
          commentCount={data.comment_count}
          bookmarkCount={data.bookmark_count}
          isAddingComment={addComment.isPending}
          onLike={handleLike}
          onComment={handleComment}
          onBookmark={handleBookmark}
          onShare={handleShare}
          onAddComment={handleAddComment}
        />
      </Card>

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
