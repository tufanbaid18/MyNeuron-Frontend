import { Avatar, Button, Input } from "antd";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import { IMPULSE_CONSTANTS } from "../../../constants/impulse.constants";
import type { FeedPostComment } from "../../../types/impulse/post.types";
import { formatTimeAgo } from "../../../utils/impulse.utils";

const { TextArea } = Input;

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
  const [showInput, setShowInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const previewComments = comments.slice(
    0,
    IMPULSE_CONSTANTS.COMMENTS_PREVIEW_COUNT,
  );
  const hasMore = comments.length > IMPULSE_CONSTANTS.COMMENTS_PREVIEW_COUNT;

  const handleCommentClick = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText("");
    setShowInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
      {previewComments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2 mb-2 last:mb-0">
          <Avatar src={comment.user.profile_image_url} size={28}>
            {!comment.user.profile_image_url && comment.user.first_name?.[0]}
          </Avatar>
          <div className="flex-1 bg-white p-2 rounded-lg border border-gray-100">
            <p className="text-sm m-0">
              <span className="font-semibold text-gray-900">
                {comment.user.first_name} {comment.user.last_name}
              </span>
              <span className="text-gray-700 ml-2">{comment.c_content}</span>
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span>{formatTimeAgo(comment.created_at)}</span>
              {comment.user.id !== userId && (
                <>
                  <Button
                    type="link"
                    size="small"
                    className="p-0 h-auto text-xs"
                  >
                    Like
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    className="p-0 h-auto text-xs"
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
          className="text-blue-500 p-0 h-auto text-sm font-medium mt-2"
        >
          View all {comments.length} comments
        </Button>
      )}

      {/* Comment input */}
      {showInput ? (
        <div className="flex items-start gap-2 mt-3">
          <TextArea
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            ref={inputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<Send className="w-4 h-4" />}
            loading={isAddingComment}
            onClick={handleSubmit}
            disabled={!commentText.trim()}
          />
        </div>
      ) : (
        <Button
          type="link"
          className="text-gray-500 p-0 h-auto text-sm font-medium mt-2"
          onClick={handleCommentClick}
        >
          Write a comment...
        </Button>
      )}
    </div>
  );
};
