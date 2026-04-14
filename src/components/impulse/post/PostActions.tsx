import { Button, Space } from "antd";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  BookmarkCheck,
} from "lucide-react";

interface PostActionsProps {
  isLiked: boolean;
  isBookmarked: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

export const PostActions = ({
  isLiked,
  isBookmarked,
  onLike,
  onComment,
  onBookmark,
  onShare,
}: PostActionsProps) => {
  return (
    <div className="flex items-center justify-around px-2 py-1 border-t border-gray-100">
      <Space size={0}>
        <Button
          type="text"
          icon={<Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />}
          onClick={onLike}
          className="rounded-full"
        />
        <Button
          type="text"
          icon={<MessageCircle className="w-5 h-5 text-gray-500" />}
          onClick={onComment}
          className="rounded-full"
        />
        <Button
          type="text"
          icon={
            isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-blue-500 fill-blue-500" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-500" />
            )
          }
          onClick={onBookmark}
          className="rounded-full"
        />
        <Button
          type="text"
          icon={<Share2 className="w-5 h-5 text-gray-500" />}
          onClick={onShare}
          className="rounded-full"
        />
      </Space>
    </div>
  );
};
