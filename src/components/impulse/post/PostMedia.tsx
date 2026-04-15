import { Image } from "antd";
import type { FeedPostMedia } from "../../../types/impulse/post.types";
import { IMPULSE_CONSTANTS } from "../../../constants/impulse.constants";

interface MediaItemProps {
  item: FeedPostMedia;
}

const MediaItem = ({ item }: MediaItemProps) => {
  if (item.is_video) {
    return (
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <video
          src={item.file_url}
          controls
          className="absolute inset-0 w-full h-full object-cover"
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <Image
      src={item.file_url}
      alt="Post media"
      className="w-full max-h-[500px] object-cover"
      preview={false}
      loading="lazy"
    />
  );
};

interface MediaGridProps {
  media: FeedPostMedia[];
}

export const PostMedia = ({ media }: MediaGridProps) => {
  const count = media.length;

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="relative w-full mt-3">
        <MediaItem item={media[0]} />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 mt-3">
        {media.map((item) => (
          <MediaItem key={item.id} item={item} />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 mt-3">
        <MediaItem item={media[0]} />
        <div className="grid grid-rows-2 gap-0.5">
          {[1, 2].map((idx) => (
            <MediaItem key={media[idx].id} item={media[idx]} />
          ))}
        </div>
      </div>
    );
  }

  // 4+ images - show 2x2 grid with +N overlay
  const visibleCount = IMPULSE_CONSTANTS.MAX_MEDIA_DISPLAY;
  const hasMore = count > visibleCount;

  return (
    <div className="grid grid-cols-2 gap-0.5 mt-3">
      {media.slice(0, visibleCount).map((item, idx) => (
        <div key={item.id} className="relative">
          <MediaItem item={item} />
          {idx === 3 && hasMore && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">+{count - visibleCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
