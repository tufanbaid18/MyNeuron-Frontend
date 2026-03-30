import React, { useState } from "react";
import {
  Tabs,
  Typography,
  Card,
  Grid,
  theme,
  Avatar,
  Space,
  Row,
  Col,
  Statistic,
  Upload,
  message,
  Divider,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  ExperimentOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import PersonalSection from "./PersonalSection";
import { IoBriefcaseOutline } from "react-icons/io5";
import ProfessionalSection from "./ProfessionalSection";
import EducationSection from "./EducationSection";
import ScientificInterestSection from "./ScientificInterestSection";
import { useUserProfile } from "../../../hooks/auth/useUserProfile";
import { usePersonalDetail } from "../../../hooks/user/useUserPersonalDetails";
import { useUploadProfileImage } from "../../../hooks/user/useUserProfile";
import { FaXTwitter, FaLinkedin } from "react-icons/fa6";

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
  const { data: personalDetails } = usePersonalDetail();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadProfileImage();

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
      icon: (
        <span
          className="anticon"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "16px",
          }}
        >
          <IoBriefcaseOutline />
        </span>
      ),
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

  const renderRegistrationHeader = () => (
    <div
      style={{
        textAlign: "center",
        marginBottom: screens.md ? "32px" : "24px",
      }}
    >
      <Title level={screens.md ? 2 : 3} style={{ margin: 0, fontWeight: 700 }}>
        Complete Your Profile
      </Title>
      <Text type="secondary" style={{ fontSize: "16px" }}>
        Please provide your detailed information before proceeding to payment.
      </Text>
    </div>
  );

  const fullName = userProfileData
    ? `${userProfileData.title ? userProfileData.title + " " : ""}${userProfileData.first_name} ${userProfileData.last_name}`
    : "";

  return (
    <div
      style={{
        background: token.colorBgLayout,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "40px",
      }}
    >
      {/* Hero Banner Area for Profile Mode */}
      {mode === "profile" && (
        <div
          style={{
            height: screens.md ? "240px" : "180px",
            background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #a259ff 100%)`,
            position: "relative",
            overflow: "hidden",
            boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* Decorative shapes */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              filter: "blur(20px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "15%",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              filter: "blur(15px)",
            }}
          />
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: screens.md ? "0 32px" : "0 16px",
          marginTop:
            mode === "profile" ? (screens.md ? "-80px" : "-60px") : "32px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {mode === "registration" && renderRegistrationHeader()}

        <Row gutter={[24, 24]} align="stretch">
          {/* Left Sidebar Profile Card (Only in Profile Mode) */}
          {mode === "profile" && userProfileData && (
            <Col xs={24} lg={8} xl={6}>
              <Card
                variant="outlined"
                style={{
                  borderRadius: "20px",
                  boxShadow: token.boxShadowSecondary,
                  textAlign: "center",
                  height: "100%",
                  paddingTop: "12px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginBottom: "20px",
                  }}
                >
                  <Avatar
                    size={screens.md ? 140 : 120}
                    src={userProfileData.profile_image}
                    icon={!userProfileData.profile_image && <UserOutlined />}
                    style={{
                      border: `5px solid ${token.colorBgContainer}`,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      opacity: isUploadingImage ? 0.6 : 1,
                      backgroundColor: token.colorPrimaryBg,
                      color: token.colorPrimary,
                      fontSize: screens.md ? "64px" : "54px",
                    }}
                  />
                  <Upload
                    customRequest={handleImageUpload}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <div
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        width: "40px",
                        height: "40px",
                        background: token.colorPrimary,
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        border: `3px solid ${token.colorBgContainer}`,
                        color: "#fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      {isUploadingImage ? (
                        <div
                          className="ant-spin ant-spin-spinning"
                          style={{ zoom: 0.6 }}
                        >
                          <span className="ant-spin-dot ant-spin-dot-spin">
                            <i
                              className="ant-spin-dot-item"
                              style={{ backgroundColor: "#fff" }}
                            ></i>
                            <i
                              className="ant-spin-dot-item"
                              style={{ backgroundColor: "#fff" }}
                            ></i>
                            <i
                              className="ant-spin-dot-item"
                              style={{ backgroundColor: "#fff" }}
                            ></i>
                            <i
                              className="ant-spin-dot-item"
                              style={{ backgroundColor: "#fff" }}
                            ></i>
                          </span>
                        </div>
                      ) : (
                        <CameraOutlined style={{ fontSize: "18px" }} />
                      )}
                    </div>
                  </Upload>
                </div>

                <Title
                  level={3}
                  style={{ margin: "0 0 4px 0", fontWeight: 700 }}
                >
                  {fullName}
                </Title>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "16px",
                    display: "block",
                    marginBottom: "24px",
                  }}
                >
                  {userProfileData.profile_title || "Explorer"}
                </Text>

                <div
                  style={{
                    background: token.colorBgLayout,
                    borderRadius: "16px",
                    padding: "16px",
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Statistic
                    title={
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>
                        FOLLOWERS
                      </span>
                    }
                    value={userProfileData.followers_count || 0}
                    valueStyle={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: token.colorPrimary,
                    }}
                  />
                  <Divider
                    type="vertical"
                    style={{ height: "auto", margin: 0 }}
                  />
                  <Statistic
                    title={
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>
                        FOLLOWING
                      </span>
                    }
                    value={userProfileData.following_count || 0}
                    valueStyle={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: token.colorPrimary,
                    }}
                  />
                </div>

                {(personalDetails?.x_handle || personalDetails?.linkedin) && (
                  <>
                    <Divider style={{ margin: "16px 0" }}>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        SOCIALS
                      </Text>
                    </Divider>
                    <Space
                      size="middle"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        display: "flex",
                      }}
                    >
                      {personalDetails?.x_handle && (
                        <a
                          href={`https://x.com/${personalDetails.x_handle.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div
                            style={{
                              display: "inline-block",
                              transition: "transform 0.2s",
                            }}
                            onMouseEnter={(
                              e: React.MouseEvent<HTMLDivElement>,
                            ) =>
                              (e.currentTarget.style.transform =
                                "translateY(-3px)")
                            }
                            onMouseLeave={(
                              e: React.MouseEvent<HTMLDivElement>,
                            ) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          >
                            <Avatar
                              size={42}
                              icon={<FaXTwitter />}
                              style={{ background: "#000", cursor: "pointer" }}
                            />
                          </div>
                        </a>
                      )}
                      {personalDetails?.linkedin && (
                        <a
                          href={
                            personalDetails.linkedin.startsWith("http")
                              ? personalDetails.linkedin
                              : `https://${personalDetails.linkedin}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div
                            style={{
                              display: "inline-block",
                              transition: "transform 0.2s",
                            }}
                            onMouseEnter={(
                              e: React.MouseEvent<HTMLDivElement>,
                            ) =>
                              (e.currentTarget.style.transform =
                                "translateY(-3px)")
                            }
                            onMouseLeave={(
                              e: React.MouseEvent<HTMLDivElement>,
                            ) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          >
                            <Avatar
                              size={42}
                              icon={<FaLinkedin />}
                              style={{
                                background: "#0077b5",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        </a>
                      )}
                    </Space>
                  </>
                )}
              </Card>
            </Col>
          )}

          {/* Main Content Area (Tabs) */}
          <Col
            xs={24}
            lg={mode === "profile" ? 16 : 24}
            xl={mode === "profile" ? 18 : 24}
          >
            <Card
              variant="outlined"
              style={{
                borderRadius: "20px",
                boxShadow: token.boxShadowSecondary,
                height: "100%",
              }}
              styles={{ body: { padding: screens.md ? "32px" : "20px" } }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                size="large"
                animated={{ inkBar: true, tabPane: true }}
                tabBarStyle={{
                  marginBottom: "32px",
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserProfileManager;
