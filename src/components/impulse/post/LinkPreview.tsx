import { Tooltip, Typography } from "antd";
import { Video } from "lucide-react";
import type { FeedLinkPreview } from "../../../types/impulse/post.types";

const { Text } = Typography;

interface LinkPreviewProps {
  linkPreview: FeedLinkPreview;
}

export const LinkPreview = ({ linkPreview }: LinkPreviewProps) => {
  if (linkPreview.type === "youtube" && linkPreview.embed_url) {
    return (
      <div style={{ position: "relative", width: "100%", marginTop: 12 }}>
        <div
          style={{
            position: "relative",
            background: "#000",
            paddingTop: "56.25%",
          }}
        >
          <iframe
            src={linkPreview.embed_url}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
            loading="lazy"
          />
        </div>
      </div>
    );
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
