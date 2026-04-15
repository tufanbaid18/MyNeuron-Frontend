import { useState } from "react";
import { sanitizePostContent } from "../../../utils/impulse.utils";
import { IMPULSE_CONSTANTS } from "../../../constants/impulse.constants";

interface PostContentProps {
  title?: string | null;
  content: string | null;
  renderExtra?: React.ReactNode;
}

export const PostContent = ({
  title,
  content,
  renderExtra,
}: PostContentProps) => {
  const [showFull, setShowFull] = useState(false);

  const shouldTruncate =
    (content?.length || 0) > IMPULSE_CONSTANTS.CONTENT_TRUNCATE_LENGTH;
  const displayContent =
    shouldTruncate && !showFull
      ? content?.slice(0, IMPULSE_CONSTANTS.CONTENT_TRUNCATE_LENGTH) + "..."
      : content;

  const sanitizedContent = sanitizePostContent(displayContent || "");

  return (
    <div className="px-4 pb-2">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      )}
      <div className="text-gray-700 leading-relaxed">
        <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        {shouldTruncate && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium ml-1"
          >
            {showFull ? "see less" : "see more"}
          </button>
        )}
      </div>
      {renderExtra}
    </div>
  );
};
