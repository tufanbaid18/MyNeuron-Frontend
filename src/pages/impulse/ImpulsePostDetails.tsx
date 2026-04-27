import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Button, Card, Skeleton } from "antd";
import { useAtomValue } from "jotai";
import { ArrowLeft } from "lucide-react";
import PostCardDetails from "../../components/impulse/PostCardDetails";
import ErrorComponent from "../../components/ui/ErrorComponent";
import { APP_ROUTES } from "../../constants/app.routes";
import { usePostDetails } from "../../hooks/impulse/useFeed";
import { impulsePostDetailsRoute } from "../../routes/impulse.routes";
import { userProfileAtom } from "../../store/auth.store";
import type { FeedPost } from "../../types/impulse/post.types";
import type { FeedPostType } from "../../types/impulse/feed.types";

function ImpulsePostDetails() {
  const { postId } = useParams({
    from: impulsePostDetailsRoute.id,
  });
  const { post_type } = useSearch({ from: impulsePostDetailsRoute.id });
  const {
    data: postResponse,
    isLoading,
    isError,
  } = usePostDetails(Number(postId), post_type);
  const user = useAtomValue(userProfileAtom);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 680,
            marginBottom: 16,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Skeleton.Button active shape="round" />
        </div>
        <Card style={{ width: "100%", maxWidth: 680, borderRadius: 8 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <Skeleton.Avatar active size={48} shape="circle" />
            <div style={{ flex: 1 }}>
              <Skeleton
                active
                title={{ width: "40%" }}
                paragraph={{ rows: 1, width: ["20%"] }}
              />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Skeleton active title={false} paragraph={{ rows: 3 }} />
          </div>
        </Card>
      </div>
    );
  }

  if (isError || !postResponse) {
    return <ErrorComponent />;
  }

  // Handle both array and single object responses safely
  const postData = Array.isArray(postResponse) ? postResponse[0] : postResponse;

  if (!postData) {
    return <ErrorComponent />;
  }

  // Map API response to FeedPost structure
  const feedPost: FeedPost = {
    id: postData.id,
    type: post_type as FeedPostType,
    data: postData,
    created_at: postData.created_at,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "20px 0",
      }}
    >
      <div style={{ width: "100%", maxWidth: 680, marginBottom: 16 }}>
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate({ to: APP_ROUTES.IMPULSE_FEED })}
          style={{
            display: "flex",
            alignItems: "center",
            color: "#4b5563",
            padding: "4px 8px",
          }}
        >
          Back to Feed
        </Button>
      </div>

      <div style={{ width: "100%", maxWidth: 680 }}>
        {user ? <PostCardDetails post={feedPost} userId={user.id} /> : null}
      </div>
    </div>
  );
}

export default ImpulsePostDetails;
