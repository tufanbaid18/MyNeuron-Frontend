import {
  AppstoreOutlined,
  CalendarOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Tag, Typography } from "antd";
import { PageCategory, type PageDetails } from "../../../types/impulse/page.types";
import { getAvatarByName } from "../../../utils/avatar.utils";

const { Title, Text, Paragraph } = Typography;

const categoryIcons: Record<string, React.ReactNode> = {
  [PageCategory.COMPANY]: <GlobalOutlined />,
  [PageCategory.EVENT]: <CalendarOutlined />,
  [PageCategory.COMMUNITY]: <TeamOutlined />,
  [PageCategory.GENERAL]: <AppstoreOutlined />,
};

interface PageItemCardProps {
  page: PageDetails;
  onFollowToggle: (pageId: number, isFollowing: boolean) => void;
  isPending: boolean;
}

const PageItemCard = ({
  page,
  onFollowToggle,
  isPending,
}: PageItemCardProps) => {
  return (
    <Card
      hoverable
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      bodyStyle={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "0",
      }}
    >
      <div
        style={{
          height: "100px",
          backgroundColor: "#f0f2f5",
          backgroundImage: page.cover_image_url
            ? `url(${page.cover_image_url})`
            : `linear-gradient(135deg, hsl(${(page.id * 137) % 360}, 70%, 80%) 0%, hsl(${
                (page.id * 137 + 60) % 360
              }, 70%, 60%) 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      />
      <div
        style={{
          padding: "0 20px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "-32px",
            marginBottom: "16px",
          }}
        >
          <Avatar
            size={64}
            src={
              page.profile_image_url ||
              getAvatarByName({
                firstName: page.page_name,
                lastName: undefined,
              })
            }
            icon={<UserOutlined />}
            style={{
              border: "4px solid #fff",
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Tag
            icon={categoryIcons[page.category]}
            color="blue"
            style={{
              margin: 0,
              marginBottom: "8px",
              textTransform: "capitalize",
            }}
          >
            {page.category}
          </Tag>
        </div>

        <div style={{ flex: 1 }}>
          <Title
            level={5}
            style={{ margin: 0 }}
            ellipsis={{ rows: 1, tooltip: page.page_name }}
          >
            {page.page_name}
          </Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {page.followers_count}{" "}
            {page.followers_count === 1 ? "Follower" : "Followers"}
          </Text>

          <Paragraph
            type="secondary"
            ellipsis={{ rows: 2 }}
            style={{
              marginTop: "12px",
              marginBottom: "0",
              minHeight: "44px",
            }}
          >
            {page.bio || "No description provided."}
          </Paragraph>
        </div>

        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #f0f0f0",
            paddingTop: "16px",
          }}
        >
          <Button
            type={page.is_following ? "default" : "primary"}
            block
            onClick={() => onFollowToggle(page.id, page.is_following)}
            loading={isPending}
          >
            {page.is_following ? "Unfollow" : "Follow"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PageItemCard;
