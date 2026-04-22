import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleFilled,
  GlobalOutlined,
  LinkOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { useRouter } from "@tanstack/react-router";
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Grid,
  Modal,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import Feed from "../../../components/impulse/Feed";
import AddPageModal from "../../../components/impulse/pages/AddPageModal";
import ErrorComponent from "../../../components/ui/ErrorComponent";
import { useUserProfile } from "../../../hooks/auth/useUserProfile";
import {
  useDeletePage,
  useFollowPage,
  usePageDetails,
  useUnfollowPage,
} from "../../../hooks/impulse/usePages";
import { impulsePageDetailsRoute } from "../../../routes/impulse.routes";
import { getAvatarByName } from "../../../utils/avatar.utils";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const PageDetails = () => {
  const router = useRouter();
  const screens = useBreakpoint();
  const { pageId } = impulsePageDetailsRoute.useParams();
  const numericPageId = Number(pageId);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const {
    data: pageDetails,
    isLoading: isPageLoading,
    error: pageError,
  } = usePageDetails(numericPageId);
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile();

  const followPage = useFollowPage();
  const unfollowPage = useUnfollowPage();
  const deletePage = useDeletePage();

  const handleFollow = () => {
    if (pageDetails?.is_following) {
      unfollowPage.mutate(numericPageId);
    } else {
      followPage.mutate(numericPageId);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete this page?",
      icon: <ExclamationCircleFilled />,
      content:
        "This action cannot be undone. All posts and followers associated with this page will be permanently removed.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          deletePage.mutate(numericPageId, {
            onSuccess: () => {
              toast.success("Page deleted successfully!");
              router.history.back();
              resolve(undefined);
            },
            onError: () => {
              toast.error("Failed to delete page. Please try again.");
              reject();
            },
          });
        });
      },
    });
  };

  if (isPageLoading || isUserLoading) {
    return (
      <div style={{ padding: "16px", margin: "0 auto" }}>
        <Skeleton.Image style={{ width: "100%", height: 300 }} active />
        <div
          style={{
            marginTop: -40,
            padding: "0 24px",
            display: "flex",
            gap: 16,
          }}
        >
          <Skeleton.Avatar active size={120} shape="circle" />
          <div style={{ marginTop: 50, flex: 1 }}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </div>
        </div>
      </div>
    );
  }

  if (pageError || userError || !pageDetails || !user) {
    return <ErrorComponent />;
  }

  const isOwner = user?.id === pageDetails?.owner?.id;

  const ownerMenuItems = [
    {
      key: "edit",
      label: "Edit Page",
      icon: <EditOutlined />,
      onClick: () => setEditModalOpen(true),
    },
    {
      key: "delete",
      label: "Delete Page",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete,
    },
  ];

  return (
    <div className="p-3">
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.history.back()}
          style={{ fontSize: 16, padding: "4px 8px" }}
        >
          Back
        </Button>

        {isOwner && (
          <Dropdown menu={{ items: ownerMenuItems }} trigger={["click"]}>
            <Button
              icon={<EllipsisOutlined />}
              shape="circle"
              size="large"
              style={{ border: "none", boxShadow: "none" }}
            />
          </Dropdown>
        )}
      </div>

      {/* Header Section */}
      <Card
        styles={{ body: { padding: 0 } }}
        style={{
          overflow: "hidden",
          marginBottom: 24,
          borderRadius: 12,
          border: "none",
        }}
      >
        {/* Cover Photo */}
        <div
          style={{
            height: screens.md ? 300 : 150,
            width: "100%",
            backgroundColor: "#f0f2f5",
            backgroundImage: pageDetails.cover_image
              ? `url(${pageDetails.cover_image})`
              : `linear-gradient(135deg, hsl(${(pageDetails.id * 137) % 360}, 70%, 80%) 0%, hsl(${
                  (pageDetails.id * 137 + 60) % 360
                }, 70%, 60%) 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Profile Info Row */}
        <div style={{ padding: "0 24px 24px", position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: screens.md ? 20 : 12,
                marginTop: screens.md ? -60 : -40,
              }}
            >
              <Avatar
                size={screens.md ? 160 : 100}
                src={
                  pageDetails.profile_image ||
                  getAvatarByName({
                    firstName: pageDetails.page_name,
                    lastName: undefined,
                  })
                }
                style={{ border: "4px solid white", backgroundColor: "#fff" }}
              >
                {pageDetails.page_name.charAt(0).toUpperCase()}
              </Avatar>

              <div style={{ paddingBottom: screens.md ? 16 : 8 }}>
                <Title level={2} style={{ margin: 0 }}>
                  {pageDetails.page_name}
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {pageDetails.followers_count} Followers •{" "}
                  {pageDetails.category}
                </Text>
              </div>
            </div>

            {!isOwner && (
              <div style={{ paddingBottom: 16 }}>
                <Button
                  type={pageDetails.is_following ? "default" : "primary"}
                  icon={
                    pageDetails.is_following ? (
                      <UserDeleteOutlined />
                    ) : (
                      <UserAddOutlined />
                    )
                  }
                  size="large"
                  onClick={handleFollow}
                  loading={followPage.isPending || unfollowPage.isPending}
                  style={{ borderRadius: 20 }}
                >
                  {pageDetails.is_following ? "Following" : "Follow"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Main Content Layout */}
      <Row gutter={[24, 24]}>
        {/* About Section */}
        <Col xs={24} md={8}>
          <Card title="About" variant={"outlined"} style={{ borderRadius: 12 }}>
            <Paragraph>{pageDetails.bio || "No bio available."}</Paragraph>

            <Space
              orientation="vertical"
              size="middle"
              style={{ width: "100%" }}
            >
              {pageDetails.company_name && (
                <div>
                  <Text type="secondary">Company</Text>
                  <div>
                    <Text strong>{pageDetails.company_name}</Text>
                  </div>
                </div>
              )}
              {pageDetails.website && (
                <div>
                  <GlobalOutlined style={{ marginRight: 8 }} />
                  <a
                    href={pageDetails.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {pageDetails.website}
                  </a>
                </div>
              )}
              {pageDetails.official_website && (
                <div>
                  <LinkOutlined style={{ marginRight: 8 }} />
                  <a
                    href={pageDetails.official_website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {pageDetails.official_website}
                  </a>
                </div>
              )}
              {(pageDetails.state || pageDetails.country) && (
                <div>
                  <Text type="secondary">Location</Text>
                  <div>
                    {pageDetails.state}
                    {pageDetails.state && pageDetails.country ? ", " : ""}
                    {pageDetails.country}
                  </div>
                </div>
              )}
            </Space>
          </Card>
        </Col>

        {/* Feed Section */}
        <Col xs={24} md={16}>
          <Feed user={user} pageId={numericPageId} />
        </Col>
      </Row>

      {/* Edit Page Modal */}
      {isOwner && (
        <AddPageModal
          open={editModalOpen}
          onCancel={() => setEditModalOpen(false)}
          pageDetails={pageDetails}
        />
      )}
    </div>
  );
};

export default PageDetails;
