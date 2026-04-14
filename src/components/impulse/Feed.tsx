import { useFeedPosts } from "../../hooks/impulse/useFeed";
import ErrorComponent from "../ui/ErrorComponent";
import Loading from "../ui/Loading";
import NoData from "../ui/NoData";
import PostCard from "./PostCard";

const Feed = () => {
  const { data, isFetching, isLoading, error } = useFeedPosts();

  if (isLoading || isFetching) return <Loading />;
  if (error) return <ErrorComponent />;
  if (data && data.length === 0) return <NoData title="No posts found" />;

  return (
    <div className="flex flex-col gap-4 my-5 items-center w-full max-w-2xl mx-auto">
      {data?.map((post) => (
        <PostCard key={post.created_at + post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
