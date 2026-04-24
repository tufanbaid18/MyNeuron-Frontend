import { Tooltip, Typography } from "antd";
import { useState, useCallback } from "react";
import { Video, VideoOff } from "lucide-react";
import type { FeedLinkPreview } from "../../../types/impulse/post.types";

const { Text } = Typography;

const EmbedFallback = ({
  watchUrl,
  message,
}: {
  watchUrl?: string;
  message?: string;
}) => (
  <div
    style={{
      width: "100%",
      marginTop: 12,
      background: "#f3f4f6",
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        paddingTop: "56.25%",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          color: "#9ca3af",
        }}
      >
        <VideoOff style={{ width: 36, height: 36 }} />
        <span style={{ fontSize: 14, fontWeight: 500 }}>
          {message || "Video preview unavailable"}
        </span>
        {watchUrl && (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              color: "#3b82f6",
              textDecoration: "none",
              padding: "6px 16px",
              borderRadius: 6,
              border: "1px solid #3b82f6",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3b82f6";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#3b82f6";
            }}
          >
            Watch on YouTube →
          </a>
        )}
      </div>
    </div>
  </div>
);

interface LinkPreviewProps {
  linkPreview: FeedLinkPreview;
}

export const LinkPreview = ({ linkPreview }: LinkPreviewProps) => {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleIframeError = useCallback(() => {
    setIframeError(true);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
  }, []);

  if (linkPreview.type === "youtube" && linkPreview.embed_url) {
    // Validate the embed URL format
    const isValidUrl =
      linkPreview.embed_url.startsWith("https://www.youtube.com/embed/") ||
      linkPreview.embed_url.startsWith("https://youtube.com/embed/");

    if (!isValidUrl || iframeError) {
      return (
        <EmbedFallback
          watchUrl={linkPreview.watch_url}
          message={
            iframeError
              ? "Could not load video player"
              : "Invalid video embed URL"
          }
        />
      );
    }

    return (
      <div style={{ position: "relative", width: "100%", marginTop: 12 }}>
        <div
          style={{
            position: "relative",
            background: "#000",
            paddingTop: "56.25%",
          }}
        >
          {/* Loading state while iframe loads */}
          {!iframeLoaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1a1a1a",
                color: "#9ca3af",
                fontSize: 13,
                zIndex: 1,
              }}
            >
              Loading video player…
            </div>
          )}
          <iframe
            src={linkPreview.embed_url}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              opacity: iframeLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
            loading="lazy"
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    );
  }

  // Non-YouTube link preview — validate watch_url exists
  if (!linkPreview.watch_url || linkPreview.watch_url.trim() === "") {
    return null;
  }

  return (
    <a
      href={linkPreview.watch_url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 12,
        marginTop: 12,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        textDecoration: "none",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: "#eff6ff",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          aspectRatio: "1 / 1",
        }}
      >
        <Video style={{ width: 20, height: 20, color: "#3b82f6" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <Tooltip title={linkPreview.watch_url}>
          <Text
            ellipsis
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              maxWidth: "100%",
            }}
          >
            {linkPreview.watch_url}
          </Text>
        </Tooltip>
        <Text
          type="secondary"
          ellipsis
          style={{ display: "block", fontSize: 12 }}
        >
          Video
        </Text>
      </div>
    </a>
  );
};
