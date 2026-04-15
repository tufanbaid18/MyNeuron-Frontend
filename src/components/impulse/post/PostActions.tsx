import { useState } from "react";
import { Button, Divider, Input } from "antd";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  BookmarkCheck,
} from "lucide-react";
import { formatCount } from "../../../utils/impulse.utils";

const { TextArea } = Input;

interface PostActionsProps {
  isLiked: boolean;
  isBookmarked: boolean;
  isLoading?: boolean;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  isAddingComment?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onAddComment?: (content: string) => void;
}

export const PostActions = ({
  isLiked,
  isBookmarked,
  isLoading,
  likeCount,
  commentCount,
  bookmarkCount,
  isAddingComment,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onAddComment,
}: PostActionsProps) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleCommentClick = () => {
    setShowCommentInput((prev) => !prev);
    onComment?.();
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    onAddComment?.(commentText.trim());
    setCommentText("");
    setShowCommentInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
        {/* Like + count */}
        <Button
          type="text"
          loading={isLoading}
          onClick={onLike}
          className="w-full flex justify-center items-center"
        >
          <ThumbsUp
            className={`w-5 h-5 ${isLiked ? "fill-blue-500 text-blue-500" : "text-gray-500"}`}
          />
          {likeCount > 0 && (
            <span
              className={`text-xs mt-0.5 ${isLiked ? "text-blue-500" : "text-gray-500"}`}
            >
              {formatCount(likeCount)}
            </span>
          )}
        </Button>
        <Divider orientation="vertical" />

        {/* Comment + count */}
        <Button
          type="text"
          onClick={handleCommentClick}
          className="w-full flex justify-center items-center"
        >
          <MessageCircle
            className={`w-5 h-5 ${showCommentInput ? "text-blue-500" : "text-gray-500"}`}
          />
          {commentCount > 0 && (
            <span
              className={`text-xs mt-0.5 ${showCommentInput ? "text-blue-500" : "text-gray-500"}`}
            >
              {formatCount(commentCount)}
            </span>
          )}
        </Button>
        <Divider orientation="vertical" />

        {/* Bookmark + count */}
        <Button
          type="text"
          loading={isLoading}
          onClick={onBookmark}
          className="w-full flex justify-center items-center"
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-blue-500 fill-blue-500" />
          ) : (
            <Bookmark className="w-5 h-5 text-gray-500" />
          )}
          {bookmarkCount > 0 && (
            <span
              className={`text-xs mt-0.5 ${isBookmarked ? "text-blue-500" : "text-gray-500"}`}
            >
              {formatCount(bookmarkCount)}
            </span>
          )}
        </Button>
        <Divider orientation="vertical" />

        {/* Share */}
        <Button
          type="text"
          onClick={onShare}
          className="w-full flex justify-center items-center"
        >
          <Share2 className="w-5 h-5 text-gray-500" />
        </Button>
      </div>

      {/* Comment input */}
      {showCommentInput && (
        <div className="flex items-start gap-2 px-4 pb-3">
          <TextArea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1"
          />
          <Button
            type="primary"
            onClick={handleSubmitComment}
            loading={isAddingComment}
            disabled={!commentText.trim()}
          >
            Post
          </Button>
        </div>
      )}
    </div>
  );
};
