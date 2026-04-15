import { Card } from "antd";
import { useNews } from "../../hooks/impulse/useFeed";
import type { FeedNewsItem } from "../../types/impulse/news.types";
import ErrorComponent from "../ui/ErrorComponent";
import FeedNewsCard from "../ui/FeedNewsCard";
import Loading from "../ui/Loading";

const FeedNews = () => {
  const { data: news, isLoading, error } = useNews();

  if (isLoading) return <Loading />;
  if (error || !news) return <ErrorComponent />;

  const handleNewsClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="border p-4">
      <h5 className="font-semibold text-lg mb-4">Latest News</h5>

      <div className="flex flex-col gap-4">
        {news.map((item: FeedNewsItem) => (
          <FeedNewsCard item={item} onClick={handleNewsClick} />
        ))}
      </div>
    </Card>
  );
};

export default FeedNews;
