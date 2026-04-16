import { Row, Col } from "antd";
import Feed from "../../components/impulse/Feed";
import FeedNews from "../../components/impulse/FeedNews";
import FeedProfile from "../../components/impulse/FeedProfile";
import MyActivityOverview from "../../components/impulse/MyActivityOverview";
import PagesOverview from "../../components/impulse/PagesOverview";
import ErrorComponent from "../../components/ui/ErrorComponent";
import Loading from "../../components/ui/Loading";
import { useUserProfile } from "../../hooks/auth/useUserProfile";

const ImpulseFeed = () => {
  const { data: user, isLoading, error } = useUserProfile();

  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent />;
  if (!user) return <ErrorComponent />;

  return (
    <div style={{ overflowX: "hidden", height: "100%" }}>
    <Row
      gutter={[16, 16]}
      style={{ padding: "8px 16px", height: "100%" }}
      wrap
    >
      {/* Left sidebar: hidden on xs/sm, visible from md up */}
      <Col xs={0} sm={0} md={7} lg={6} xl={5} xxl={4}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FeedProfile user={user} />
          <MyActivityOverview />
          <PagesOverview />
        </div>
      </Col>

      {/* Main feed: full width on mobile, center column on desktop */}
      <Col xs={24} sm={24} md={17} lg={12} xl={14} xxl={16}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            maxWidth: 680,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Feed user={user} />
        </div>
      </Col>

      {/* Right sidebar: hidden on xs/sm/md, visible from lg up */}
      <Col xs={0} sm={0} md={0} lg={6} xl={5} xxl={4}>
        <FeedNews />
      </Col>
    </Row>
    </div>
  );
};

export default ImpulseFeed;
