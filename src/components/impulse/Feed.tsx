import { useEffect, useRef, useState } from "react";
import { useFeedPosts } from "../../hooks/impulse/useFeed";
import ErrorComponent from "../ui/ErrorComponent";
import Loading from "../ui/Loading";
import NoData from "../ui/NoData";
import PostCard from "./PostCard";
import { useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "../../types/user/user.types";
import CreatePostComponent from "./CreatePostComponent";

interface FeedProps {
  user: UserProfile;
}

const Feed = ({ user }: FeedProps) => {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isFetching, isLoading, error, dataUpdatedAt } = useFeedPosts();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const scroll記憶Ref = useRef<{ postId: number | null; offset: number }>({
    postId: null,
    offset: 0,
  });
  const lastFetchTimeRef = useRef<number>(0);

  // Restore scroll position after data loads
  useEffect(() => {
    if (!data || isFetching) return;

    if (lastFetchTimeRef.current === 0) {
      lastFetchTimeRef.current = dataUpdatedAt;
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const { postId, offset } = scroll記憶Ref.current;
    if (postId !== null) {
      const el = container.querySelector(`[data-post-id="${postId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
        if (offset > 0) {
          window.scrollBy({ top: offset, behavior: "instant" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      scroll記憶Ref.current = { postId: null, offset: 0 };
    }

    lastFetchTimeRef.current = dataUpdatedAt;
  }, [data, isFetching, dataUpdatedAt]);

  const captureScrollAndRefresh = () => {
    const container = containerRef.current;
    const firstVisible = container?.querySelector("[data-post-id]");
    if (firstVisible) {
      const rect = firstVisible.getBoundingClientRect();
      const firstId = Number(firstVisible.getAttribute("data-post-id"));
      scroll記憶Ref.current = {
        postId: firstId,
        offset: window.scrollY - rect.top,
      };
    } else {
      scroll記憶Ref.current = { postId: null, offset: 0 };
    }
    queryClient.invalidateQueries({ queryKey: ["get-feed-posts"] });
  };

  if (isLoading || isFetching) return <Loading />;
  if (error) return <ErrorComponent />;
  // if (data && data.length === 0) return <NoData title="No posts found" />;

  return (
    <>
      <CreatePostComponent
        open={createOpen}
        onOpen={() => setCreateOpen(true)}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          captureScrollAndRefresh();
        }}
        user={user}
      />

      {data && data.length === 0 && <NoData title="No post found" />}

      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 20,
          marginBottom: 20,
          alignItems: "center",
          width: "100%",
        }}
      >
        {data?.map((post) => (
          <PostCard
            key={post.created_at + post.id}
            post={post}
            userId={user.id}
            onNewPost={captureScrollAndRefresh}
          />
        ))}
      </div>
    </>
  );
};

export default Feed;
