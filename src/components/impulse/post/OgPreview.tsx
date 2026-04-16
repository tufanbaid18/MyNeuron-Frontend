import DOMPurify from "dompurify";
import { parseOgPreviewFromContent } from "../../../utils/impulse.utils";

interface OgPreviewProps {
  content: string;
  hasLinkPreview?: boolean;
}

export const OgPreview = ({ content, hasLinkPreview }: OgPreviewProps) => {
  // Don't render OG preview if backend already provided link_preview
  if (hasLinkPreview) return null;

  const ogHtml = parseOgPreviewFromContent(content);
  if (!ogHtml) return null;

  return (
    <div
      style={{
        marginTop: 12,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ogHtml) }}
    />
  );
};
