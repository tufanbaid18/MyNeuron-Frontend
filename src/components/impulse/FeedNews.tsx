import { Card, Skeleton, Typography } from "antd";
import ErrorComponent from "../../components/ui/ErrorComponent";
import FeedNewsCard from "../../components/ui/FeedNewsCard";
import { useNews } from "../../hooks/impulse/useFeed";
import type { FeedNewsItem } from "../../types/impulse/news.types";

const { Text } = Typography;

const FeedNews = () => {
  const { data: news, isLoading, error } = useNews();

  if (isLoading) {
    return (
      <Card style={{ padding: 16 }}>
        <Text strong style={{ fontSize: 17, display: "block", marginBottom: 16 }}>
          Latest News
        </Text>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              styles={{ body: { padding: 12 } }}
              style={{
                border: "1px solid #e5e7eb",
                background: "#fafafa",
              }}
            >
              <Skeleton
                active
                avatar={{ shape: "square", size: 48 }}
                title={false}
                paragraph={{ rows: 2, width: ["100%", "60%"] }}
              />
            </Card>
          ))}
        </div>
      </Card>
    );
  }
  if (error || !news) return <ErrorComponent />;

  const handleNewsClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card style={{ padding: 16 }}>
      <Text strong style={{ fontSize: 17, display: "block", marginBottom: 16 }}>
        Latest News
      </Text>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {news.map((item: FeedNewsItem) => (
          <FeedNewsCard
            key={item.title}
            item={item}
            onClick={handleNewsClick}
          />
        ))}
      </div>
    </Card>
  );
};

export default FeedNews;
