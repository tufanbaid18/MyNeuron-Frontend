import { Video } from "lucide-react";
import type { FeedLinkPreview } from "../../../types/impulse/post.types";

interface LinkPreviewProps {
  linkPreview: FeedLinkPreview;
}

export const LinkPreview = ({ linkPreview }: LinkPreviewProps) => {
  if (linkPreview.type === "youtube" && linkPreview.embed_url) {
    return (
      <div className="relative w-full mt-3">
        <div className="relative bg-black" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={linkPreview.embed_url}
            className="absolute inset-0 w-full h-full"
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
      className="flex items-center gap-3 p-3 mt-3 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="w-12 h-12 bg-blue-50 rounded flex items-center justify-center shrink-0">
        <Video className="w-5 h-5 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{linkPreview.watch_url}</p>
        <p className="text-xs text-gray-500 truncate">Video</p>
      </div>
    </a>
  );
};
