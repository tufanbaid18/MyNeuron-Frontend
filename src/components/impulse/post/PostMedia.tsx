import { Image } from "antd";
import { useState, useCallback } from "react";
import { ImageOff, VideoOff } from "lucide-react";
import type { FeedPostMedia } from "../../../types/impulse/post.types";
import { IMPULSE_CONSTANTS } from "../../../constants/impulse.constants";

interface MediaItemProps {
  item: FeedPostMedia;
}

const BrokenMediaFallback = ({
  isVideo,
  message,
}: {
  isVideo: boolean;
  message?: string;
}) => (
  <div
    style={{
      width: "100%",
      paddingTop: isVideo ? "56.25%" : undefined,
      minHeight: isVideo ? undefined : 200,
      position: "relative",
      background: "#f3f4f6",
      borderRadius: 4,
    }}
  >
    <div
      style={{
        position: isVideo ? "absolute" : "relative",
        inset: isVideo ? 0 : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        height: isVideo ? "100%" : 200,
        color: "#9ca3af",
      }}
    >
      {isVideo ? (
        <VideoOff style={{ width: 32, height: 32 }} />
      ) : (
        <ImageOff style={{ width: 32, height: 32 }} />
      )}
      <span style={{ fontSize: 13, fontWeight: 500 }}>
        {message || (isVideo ? "Video unavailable" : "Image unavailable")}
      </span>
    </div>
  </div>
);

const VideoItem = ({ item }: MediaItemProps) => {
  const [hasError, setHasError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setCanPlay(true);
  }, []);

  // If URL is missing or empty, show fallback immediately
  if (!item.file_url || item.file_url.trim() === "") {
    return <BrokenMediaFallback isVideo message="No video source" />;
  }

  if (hasError) {
    return (
      <BrokenMediaFallback isVideo message="Video could not be loaded" />
    );
  }

  return (
    <div
      style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}
    >
      {/* Loading skeleton shown until video can play */}
      {!canPlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f3f4f6",
            color: "#9ca3af",
            fontSize: 13,
          }}
        >
          Loading video…
        </div>
      )}
      <video
        src={item.file_url}
        controls
        preload="metadata"
        onError={handleError}
        onCanPlay={handleCanPlay}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: canPlay ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Fallback message for browsers that don't support <video> */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

const ImageItem = ({ item }: MediaItemProps) => {
  const [hasError, setHasError] = useState(false);

  // If URL is missing or empty, show fallback immediately
  if (!item.file_url || item.file_url.trim() === "") {
    return <BrokenMediaFallback isVideo={false} message="No image source" />;
  }

  if (hasError) {
    return (
      <BrokenMediaFallback
        isVideo={false}
        message="Image could not be loaded"
      />
    );
  }

  return (
    <Image
      src={item.file_url}
      alt="Post media"
      style={{
        width: "100%",
        maxHeight: 500,
        objectFit: "cover",
        display: "block",
      }}
      preview={false}
      loading="lazy"
      onError={() => {
        setHasError(true);
      }}
    />
  );
};

const MediaItem = ({ item }: MediaItemProps) => {
  if (item.is_video) {
    return <VideoItem item={item} />;
  }
  return <ImageItem item={item} />;
};

interface MediaGridProps {
  media: FeedPostMedia[];
}

export const PostMedia = ({ media }: MediaGridProps) => {
  // Guard against null/undefined media
  if (!media || !Array.isArray(media)) return null;

  const count = media.length;

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div
        style={{ position: "relative", width: "100%", marginTop: 12 }}
        className="flex justify-center items-center bg-gray-100"
      >
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
