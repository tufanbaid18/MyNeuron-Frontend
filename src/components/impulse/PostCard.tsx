import { Card } from "antd";
import type { FeedPost } from "../../types/impulse/post.types";

export const PostCard = ({ post }: { post: FeedPost }) => {
  return (
    <Card styles={{ body: { padding: 0 } }}>
      <>{JSON.stringify(post, null, 2)}</>
    </Card>
  );
};
