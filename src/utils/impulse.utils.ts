import DOMPurify from "dompurify";
import type { OgMetaResponse } from "../types/impulse/post.types";

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay}d`;
  if (diffHour > 0) return `${diffHour}h`;
  if (diffMin > 0) return `${diffMin}m`;
  return "now";
};

export const formatCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

export const sanitizePostContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "a",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "pre",
      "code",
      "img",
      "span",
      "s",
      "u",
      "sub",
      "sup",
      "div",
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "width",
      "height",
      "class",
      "style",
    ],
  });
};

export const buildOgHtml = (res: OgMetaResponse): string => {
  const og = res.og;
  const isVideo = res.type === "youtube" || res.embed_url;

  if (isVideo && res.embed_url) {
    return `
    <div class="og-card og-video-card" contenteditable="false"
         style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:12px 0;font-family:Arial,sans-serif;">
      <div style="position:relative;padding-top:56.25%;background:#000;">
        <iframe
          src="${res.embed_url}"
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          title="Video preview"
        ></iframe>
      </div>
      <div style="padding:12px;">
        <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">${og["og:site_name"] || "Video"}</div>
        <div style="font-size:16px;font-weight:600;margin-bottom:6px;">${og["og:title"] || "Video"}</div>
        ${og["og:description"] ? `<div style="font-size:14px;color:#374151;">${og["og:description"]}</div>` : ""}
      </div>
    </div><p></p>
  `;
  }

  return `
    <div class="og-card" contenteditable="false"
         style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:12px 0;font-family:Arial,sans-serif;">
      ${
        og["og:image"]
          ? `<img src="${og["og:image"]}" alt="${og["og:title"]}" style="width:100%;max-height:300px;object-fit:cover;" />`
          : ""
      }
      <div style="padding:12px;">
        <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">${og["og:site_name"] || ""}</div>
        <div style="font-size:16px;font-weight:600;margin-bottom:6px;">${og["og:title"]}</div>
        <div style="font-size:14px;color:#374151;">${og["og:description"] || ""}</div>
        <a href="${res.url}" target="_blank" style="display:inline-block;margin-top:8px;font-size:13px;color:#2563eb;">Read more →</a>
      </div>
    </div><p></p>
  `;
};

export const parseOgPreviewFromContent = (content: string): string | null => {
  const ogMatch = content.match(/<div class="og-card"[^>]*>[\s\S]*?<\/div><p><\/p>/);
  return ogMatch ? ogMatch[0] : null;
};
