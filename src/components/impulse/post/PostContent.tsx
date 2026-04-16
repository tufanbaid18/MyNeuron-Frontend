import { useState } from "react";
import { Typography } from "antd";
import { sanitizePostContent } from "../../../utils/impulse.utils";
import { IMPULSE_CONSTANTS } from "../../../constants/impulse.constants";

const { Text } = Typography;

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
    <div style={{ padding: "0 16px 8px" }}>
      {title && (
        <Text
          strong
          style={{
            display: "block",
            fontSize: 17,
            color: "#1a1a1a",
            marginBottom: 4,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {title}
        </Text>
      )}
      <div
        style={{
          color: "#374151",
          lineHeight: 1.6,
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        {shouldTruncate && (
          <button
            onClick={() => setShowFull(!showFull)}
            style={{
              color: "#3b82f6",
              fontSize: 13,
              fontWeight: 500,
              marginLeft: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {showFull ? "see less" : "see more"}
          </button>
        )}
      </div>
      {renderExtra}
    </div>
  );
};
