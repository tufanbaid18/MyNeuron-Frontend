import { Image } from "antd";
import type { FeedPostMedia } from "../../../types/impulse/post.types";
import { IMPULSE_CONSTANTS } from "../../../constants/impulse.constants";

interface MediaItemProps {
  item: FeedPostMedia;
}

const MediaItem = ({ item }: MediaItemProps) => {
  if (item.is_video) {
    return (
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
        <video
          src={item.file_url}
          controls
          preload="metadata"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  return (
    <Image
      src={item.file_url}
      alt="Post media"
      style={{ width: "100%", maxHeight: 500, objectFit: "cover", display: "block" }}
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
      <div style={{ position: "relative", width: "100%", marginTop: 12 }}>
        <MediaItem item={media[0]} />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          marginTop: 12,
        }}
      >
        {media.map((item) => (
          <MediaItem key={item.id} item={item} />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          marginTop: 12,
        }}
      >
        <MediaItem item={media[0]} />
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 2 }}>
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        marginTop: 12,
      }}
    >
      {media.slice(0, visibleCount).map((item, idx) => (
        <div key={item.id} style={{ position: "relative" }}>
          <MediaItem item={item} />
          {idx === 3 && hasMore && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                +{count - visibleCount}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
