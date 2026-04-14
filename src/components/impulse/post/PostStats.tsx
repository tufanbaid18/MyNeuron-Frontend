import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { formatCount } from "../../../utils/impulse.utils";

interface PostStatsProps {
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
}

export const PostStats = ({
  likeCount,
  commentCount,
  bookmarkCount,
}: PostStatsProps) => {
  const hasStats = likeCount > 0 || commentCount > 0 || bookmarkCount > 0;

  if (!hasStats) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500">
      <div className="flex items-center gap-1">
        {likeCount > 0 && (
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            {formatCount(likeCount)}
          </span>
        )}
        {commentCount > 0 && (
          <span className="ml-3 flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {formatCount(commentCount)}
          </span>
        )}
      </div>
      {bookmarkCount > 0 && (
        <span className="flex items-center gap-1">
          <Bookmark className="w-4 h-4" />
          {formatCount(bookmarkCount)}
        </span>
      )}
    </div>
  );
};
