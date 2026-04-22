import { Avatar, Button, Input, Typography } from "antd";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import { IMPULSE_CONSTANTS } from "../../../constants/impulse.constants";
import type { FeedPostComment } from "../../../types/impulse/post.types";
import { formatTimeAgo } from "../../../utils/impulse.utils";

const { TextArea } = Input;
const { Text } = Typography;

interface PostCommentsProps {
  comments: FeedPostComment[];
  postId: number;
  userId: number;
  onAddComment: (content: string) => void;
  isAddingComment?: boolean;
}

export const PostComments = ({
  comments,
  userId,
  onAddComment,
  isAddingComment,
}: PostCommentsProps) => {
  const [commentText, setCommentText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const previewComments = comments.slice(
    0,
    IMPULSE_CONSTANTS.COMMENTS_PREVIEW_COUNT,
  );
  const hasMore = comments.length > IMPULSE_CONSTANTS.COMMENTS_PREVIEW_COUNT;

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        padding: "12px 16px",
        borderTop: "1px solid #f3f4f6",
        background: "rgba(249,250,251,0.5)",
      }}
    >
      {previewComments.map((comment) => (
        <div
          key={comment.id}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Avatar
            src={comment.user.profile_image_url}
            size={28}
            style={{ flexShrink: 0, aspectRatio: "1 / 1" }}
          >
            {!comment.user.profile_image_url && comment.user.first_name?.[0]}
          </Avatar>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              background: "#fff",
              padding: 8,
              borderRadius: 8,
              border: "1px solid #f3f4f6",
            }}
          >
            <div style={{ fontSize: 13, margin: 0, wordBreak: "break-word", overflowWrap: "break-word" }}>
              <Text strong style={{ color: "#1a1a1a", fontSize: 13 }}>
                {comment.user.first_name} {comment.user.last_name}
              </Text>
              <span style={{ color: "#374151", marginLeft: 8 }}>{comment.c_content}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 4,
                fontSize: 12,
                color: "#9ca3af",
                flexWrap: "wrap",
              }}
            >
              <span>{formatTimeAgo(comment.created_at)}</span>
              {comment.user.id !== userId && (
                <>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, height: "auto", fontSize: 12 }}
                  >
                    Like
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, height: "auto", fontSize: 12 }}
                  >
                    Reply
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      {hasMore && (
        <Button
          type="link"
          style={{
            color: "#3b82f6",
            padding: 0,
            height: "auto",
            fontSize: 13,
            fontWeight: 500,
            marginTop: 8,
          }}
        >
          View all {comments.length} comments
        </Button>
      )}

      {/* Comment input */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          marginTop: 12,
        }}
      >
        <TextArea
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          ref={inputRef}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<Send style={{ width: 16, height: 16 }} />}
          loading={isAddingComment}
          onClick={handleSubmit}
          disabled={!commentText.trim()}
        />
      </div>
    </div>
  );
};
