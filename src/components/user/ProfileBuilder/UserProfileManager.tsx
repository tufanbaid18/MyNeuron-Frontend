import React, { useState } from "react";
import { Tabs, Typography, Card, Grid, theme, Avatar, Space, Row, Col, Statistic, Upload, message } from "antd";
import {
  UserOutlined,
  BookOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import PersonalSection from "./PersonalSection";
import { IoBriefcaseOutline } from "react-icons/io5";
import ProfessionalSection from "./ProfessionalSection";
import EducationSection from "./EducationSection";
import ScientificInterestSection from "./ScientificInterestSection";
import { useUserProfile } from "../../../hooks/auth/useUserProfile";
import { useUploadProfileImage } from "../../../hooks/user/useUserProfile";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

type UserProfileManagerProps = {
  mode?: "profile" | "registration";
};

const UserProfileManager: React.FC<UserProfileManagerProps> = ({
  mode = "profile",
}) => {
  const screens = useBreakpoint();
  const { token } = theme.useToken();
  const [activeTab, setActiveTab] = useState("personal");
  const { data: userProfileData } = useUserProfile(mode === "profile");
  const { mutateAsync: uploadImage, isPending: isUploadingImage } = useUploadProfileImage();

  // Determine if we should show tabs vertically or horizontally based on screen size
  const tabPosition = screens.md ? "left" : "top";

  const items = [
    {
      key: "personal",
      label: "Personal Details",
      icon: <UserOutlined />,
      children: <PersonalSection mode={mode} />,
    },
    {
      key: "professional",
      label: "Professional Details",
      icon: <IoBriefcaseOutline />,
      children: <ProfessionalSection mode={mode} />,
    },
    {
      key: "education",
      label: "Education",
      icon: <BookOutlined />,
      children: <EducationSection mode={mode} />,
    },
    {
      key: "scientific_interest",
      label: "Scientific Interests",
      icon: <ExperimentOutlined />,
      children: <ScientificInterestSection mode={mode} />,
    },
  ];

  const handleImageUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("profile_image", file);
    try {
      await uploadImage(formData);
      onSuccess?.("ok");
      message.success("Profile picture updated!");
    } catch (err) {
      onError?.(err as Error);
      message.error("Failed to update profile picture.");
    }
  };

  const renderHeader = () => {
    if (mode === "registration") {
      return (
        <div style={{ textAlign: "center", marginBottom: screens.md ? "24px" : "16px" }}>
          <Title level={screens.md ? 2 : 3} style={{ margin: 0 }}>
            Complete Your Profile
          </Title>
          <Text type="secondary">
            Please provide your detailed information before proceeding to payment.
          </Text>
        </div>
      );
    }

    if (!userProfileData) {
      return null;
    }

    const fullName = `${userProfileData.title ? userProfileData.title + " " : ""}${userProfileData.first_name} ${userProfileData.last_name}`;

    return (
      <Card
        bordered={false}
        style={{
          borderRadius: "16px",
          marginBottom: "16px",
          background: "linear-gradient(to right, #ffffff, #f0f5ff)",
        }}
      >
        <Row align="middle" gutter={24}>
          <Col>
            <Upload customRequest={handleImageUpload} showUploadList={false} accept="image/*">
              <div style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
                <Avatar
                  size={100}
                  src={userProfileData.profile_image}
                  icon={!userProfileData.profile_image && <UserOutlined />}
                  style={{ 
                    border: `2px solid ${token.colorPrimary}`, 
                    opacity: isUploadingImage ? 0.5 : 1,
                    transition: "opacity 0.3s"
                  }}
                />
                {isUploadingImage && (
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <div className="ant-spin ant-spin-spinning"><span className="ant-spin-dot ant-spin-dot-spin"><i className="ant-spin-dot-item"></i><i className="ant-spin-dot-item"></i><i className="ant-spin-dot-item"></i><i className="ant-spin-dot-item"></i></span></div>
                  </div>
                )}
              </div>
            </Upload>
          </Col>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              {fullName}
            </Title>
            <Text type="secondary" style={{ fontSize: "16px", display: "block", marginBottom: "8px" }}>
              {userProfileData.profile_title || "Explorer"}
            </Text>
            <Space size="large">
              <Statistic title="Followers" value={userProfileData.followers_count || 0} valueStyle={{ fontSize: 16 }} />
              <Statistic title="Following" value={userProfileData.following_count || 0} valueStyle={{ fontSize: 16 }} />
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div
      style={{
        padding: screens.md ? "24px" : "12px",
        background: token.colorBgLayout,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {renderHeader()}

      <Card
        bordered={false}
        style={{
          borderRadius: "16px",
          boxShadow: token.boxShadowTertiary,
          overflow: "hidden",
        }}
        styles={{ body: { padding: screens.md ? "24px" : "16px" } }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabPosition={tabPosition}
          items={items}
          size="large"
          animated={{ inkBar: true, tabPane: true }}
        />
      </Card>
    </div>
  );
};

export default UserProfileManager;
