import { Avatar, Card, Typography } from "antd";
import type { FeedNewsItem } from "../../types/impulse/news.types";

const { Paragraph, Text } = Typography;

type FeedNewsCardProps = {
  item: FeedNewsItem;
  onClick: (url: string) => void;
};

function FeedNewsCard({ item, onClick }: FeedNewsCardProps) {
  return (
    <Card
      onClick={() => onClick(item.link)}
      key={item.title}
      styles={{ body: { padding: 12 } }}
      style={{
        cursor: "pointer",
        transition: "all 0.2s",
        border: "1px solid #e5e7eb",
        background: "#fafafa",
      }}
      hoverable
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Avatar
          src={item.thumbnail}
          shape="square"
          size={48}
          style={{ flexShrink: 0, aspectRatio: "1 / 1" }}
        />

        <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
          <Paragraph
            ellipsis={{ rows: 2, tooltip: item.title }}
            strong
            style={{
              fontSize: 13,
              color: "#1a1a1a",
              marginBottom: 0,
            }}
          >
            {item.title}
          </Paragraph>
          <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
            {item.source}
          </Text>
        </div>
      </div>
    </Card>
  );
}

export default FeedNewsCard;
