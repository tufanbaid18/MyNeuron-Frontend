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

  const iconSize = { width: 18, height: 18, flexShrink: 0 };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 8px",
          borderTop: "1px solid #f3f4f6",
          gap: 4,
          flexWrap: "nowrap",
        }}
      >
        {/* Like + count */}
        <Button
          type="text"
          loading={isLoading}
          onClick={onLike}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            minWidth: 0,
            padding: "4px 6px",
          }}
        >
          <ThumbsUp
            style={{
              ...iconSize,
              fill: isLiked ? "#3b82f6" : "none",
              color: isLiked ? "#3b82f6" : "#6b7280",
            }}
          />
          {likeCount > 0 && (
            <span
              style={{
                fontSize: 12,
                color: isLiked ? "#3b82f6" : "#6b7280",
                whiteSpace: "nowrap",
              }}
            >
              {formatCount(likeCount)}
            </span>
          )}
        </Button>
        <Divider type="vertical" style={{ margin: "0 2px" }} />

        {/* Comment + count */}
        <Button
          type="text"
          onClick={handleCommentClick}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            minWidth: 0,
            padding: "4px 6px",
          }}
        >
          <MessageCircle
            style={{
              ...iconSize,
              color: showCommentInput ? "#3b82f6" : "#6b7280",
            }}
          />
          {commentCount > 0 && (
            <span
              style={{
                fontSize: 12,
                color: showCommentInput ? "#3b82f6" : "#6b7280",
                whiteSpace: "nowrap",
              }}
            >
              {formatCount(commentCount)}
            </span>
          )}
        </Button>
        <Divider type="vertical" style={{ margin: "0 2px" }} />

        {/* Bookmark + count */}
        <Button
          type="text"
          loading={isLoading}
          onClick={onBookmark}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            minWidth: 0,
            padding: "4px 6px",
          }}
        >
          {isBookmarked ? (
            <BookmarkCheck
              style={{
                ...iconSize,
                color: "#3b82f6",
                fill: "#3b82f6",
              }}
            />
          ) : (
            <Bookmark style={{ ...iconSize, color: "#6b7280" }} />
          )}
          {bookmarkCount > 0 && (
            <span
              style={{
                fontSize: 12,
                color: isBookmarked ? "#3b82f6" : "#6b7280",
                whiteSpace: "nowrap",
              }}
            >
              {formatCount(bookmarkCount)}
            </span>
          )}
        </Button>
        <Divider type="vertical" style={{ margin: "0 2px" }} />

        {/* Share */}
        <Button
          type="text"
          onClick={onShare}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 0,
            padding: "4px 6px",
          }}
        >
          <Share2 style={{ ...iconSize, color: "#6b7280" }} />
        </Button>
      </div>

      {/* Comment input */}
      {showCommentInput && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            padding: "8px 16px 12px",
          }}
        >
          <TextArea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ flex: 1 }}
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
