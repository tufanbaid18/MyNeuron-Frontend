import { Row, Col, Skeleton, Card } from "antd";
import Feed from "../../components/impulse/Feed";
import FeedNews from "../../components/impulse/FeedNews";
import FeedProfile from "../../components/impulse/FeedProfile";
import MyActivityOverview from "../../components/impulse/MyActivityOverview";
import PagesOverview from "../../components/impulse/PagesOverview";
import ErrorComponent from "../../components/ui/ErrorComponent";
import { useUserProfile } from "../../hooks/auth/useUserProfile";

const ImpulseFeed = () => {
  const { data: user, isLoading, error } = useUserProfile();

  if (isLoading) {
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
              <Card variant="borderless">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <Skeleton.Avatar active size={80} shape="circle" />
                  <Skeleton active paragraph={{ rows: 1, width: ["80%"] }} title={false} />
                  <Skeleton.Button active block shape="round" />
                </div>
              </Card>
              <Card>
                <Skeleton active title paragraph={{ rows: 4 }} />
              </Card>
              <Card>
                <Skeleton active title paragraph={{ rows: 3 }} />
              </Card>
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
                gap: 16,
              }}
            >
              {[1, 2, 3].map((key) => (
                <Card key={key}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Skeleton.Avatar active size={48} shape="circle" />
                    <div style={{ flex: 1 }}>
                      <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 1, width: ["20%"] }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Skeleton active title={false} paragraph={{ rows: 3 }} />
                  </div>
                </Card>
              ))}
            </div>
          </Col>

          {/* Right sidebar: hidden on xs/sm/md, visible from lg up */}
          <Col xs={0} sm={0} md={0} lg={6} xl={5} xxl={4}>
            <FeedNews />
          </Col>
        </Row>
      </div>
    );
  }
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
