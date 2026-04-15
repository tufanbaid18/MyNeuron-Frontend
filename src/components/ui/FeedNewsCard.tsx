import { Avatar, Card } from "antd";
import type { FeedNewsItem } from "../../types/impulse/news.types";

type FeedNewsCardProps = {
  item: FeedNewsItem;
  onClick: (url: string) => void;
};

function FeedNewsCard({ item, onClick }: FeedNewsCardProps) {
  return (
    <Card
      onClick={() => onClick(item.link)}
      key={item.title}
      bodyStyle={{ padding: "12px" }}
      className="
            bg-gray-50
              cursor-pointer 
              transition-all duration-200
              hover:shadow-md 
              dark:hover:shadow-gray-800
              dark:bg-neutral-900
              border border-gray-200 dark:border-neutral-800
            "
    >
      {/* THIS is the actual flex container */}
      <div className="flex items-center gap-3">
        <Avatar
          src={item.thumbnail}
          shape="square"
          size={48}
          className="shrink-0"
        />

        <div className="min-w-0">
          <p className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-gray-100">
            {item.title}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {item.source}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default FeedNewsCard;
