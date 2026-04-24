import { Button, Divider } from "antd";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  BookmarkCheck,
} from "lucide-react";

interface PostActionsProps {
  isLiked: boolean;
  isBookmarked: boolean;
  isLoading?: boolean;
  isAddingComment?: boolean;
  showCommentButton?: boolean;
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
  showCommentButton,
  onLike,
  onComment,
  onBookmark,
  onShare,
}: PostActionsProps) => {
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
        </Button>
        <Divider orientation="vertical" style={{ margin: "0 2px" }} />

        {/* Comment - only shown in feed, not in post details */}
        {showCommentButton !== false && (
          <>
            <Button
              type="text"
              onClick={onComment}
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
                  color: "#6b7280",
                }}
              />
            </Button>
            <Divider type="vertical" style={{ margin: "0 2px" }} />
          </>
        )}

        {/* Bookmark */}
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
        </Button>
        <Divider orientation="vertical" style={{ margin: "0 2px" }} />

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
    </div>
  );
};
