import { Card, Typography } from "antd";
import ErrorComponent from "../../components/ui/ErrorComponent";
import FeedNewsCard from "../../components/ui/FeedNewsCard";
import Loading from "../../components/ui/Loading";
import { useNews } from "../../hooks/impulse/useFeed";
import type { FeedNewsItem } from "../../types/impulse/news.types";

const { Text } = Typography;

const FeedNews = () => {
  const { data: news, isLoading, error } = useNews();

  if (isLoading) return <Loading />;
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
