import { ThumbsUp } from "lucide-react";
import { formatCount } from "../../../utils/impulse.utils";
import { useNavigate } from "@tanstack/react-router";
import { impulsePostDetailsRoute } from "../../../routes/impulse.routes";
import type { FeedPostType } from "../../../types/impulse/feed.types";

interface PostStatsProps {
  postId: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  postType: FeedPostType;
}

export const PostStats = ({
  postId,
  likeCount,
  commentCount,
  isLiked,
  postType,
}: PostStatsProps) => {
  const navigate = useNavigate();
  if (likeCount === 0 && commentCount === 0) {
    return null;
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 16px",
        fontSize: 13,
        color: "#6b7280",
      }}
      className="border-t border-gray-100"
      onClick={() =>
        navigate({
          to: impulsePostDetailsRoute.to,
          params: { postId },
          search: { post_type: postType },
        })
      }
    >
      {/* Like count */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {likeCount > 0 && (
          <>
            <ThumbsUp
              style={{
                width: 14,
                height: 14,
                fill: isLiked ? "#3b82f6" : "#6b7280",
                color: isLiked ? "#3b82f6" : "#6b7280",
              }}
            />
            <span style={{ color: isLiked ? "#3b82f6" : "#6b7280" }}>
              {formatCount(likeCount)}
            </span>
          </>
        )}
      </div>

      {/* Comment count */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {commentCount > 0 && (
          <>
            <span>{formatCount(commentCount)} comments</span>
          </>
        )}
      </div>
    </div>
  );
};
