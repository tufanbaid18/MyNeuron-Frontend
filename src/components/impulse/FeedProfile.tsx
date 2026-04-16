import { Button, Card, Divider, Tooltip, Typography } from "antd";
import Avatar from "antd/es/avatar/Avatar";
import type { UserProfile } from "../../types/user/user.types";
import { getAvatarByName } from "../../utils/avatar.utils";
import { useNavigate } from "@tanstack/react-router";
import { APP_ROUTES } from "../../constants/app.routes";

const { Text } = Typography;

const FeedProfile = ({ user }: { user: UserProfile }) => {
  const navigate = useNavigate();

  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const orgName = user?.professional_detail?.current_organization ?? "";
  const roleName = user?.professional_detail?.current_role ?? "";

  return (
    <Card variant="borderless" style={{ height: "max-content" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Avatar
          src={
            user.profile_image ||
            getAvatarByName({
              firstName: user.first_name,
              lastName: user.last_name,
            })
          }
          size={80}
          style={{ flexShrink: 0, aspectRatio: "1 / 1" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Tooltip title={fullName}>
            <Text
              strong
              ellipsis
              style={{
                maxWidth: "100%",
                display: "block",
                textAlign: "center",
              }}
            >
              {fullName}
            </Text>
          </Tooltip>
          {roleName && (
            <Tooltip title={roleName}>
              <Text
                type="secondary"
                ellipsis
                style={{
                  maxWidth: "100%",
                  fontSize: 13,
                  display: "block",
                  textAlign: "center",
                }}
              >
                {roleName}
              </Text>
            </Tooltip>
          )}
        </div>
        <Divider style={{ padding: 0, margin: 0 }} />
        {user?.professional_detail && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                width: "100%",
                borderRadius: 8,
                padding: 8,
                overflow: "hidden",
              }}
            >
              {orgName && (
                <Tooltip title={orgName}>
                  <Text
                    strong
                    ellipsis
                    style={{ maxWidth: "100%", display: "block" }}
                  >
                    {orgName}
                  </Text>
                </Tooltip>
              )}
              {roleName && (
                <Tooltip title={roleName}>
                  <Text
                    type="secondary"
                    ellipsis
                    style={{
                      maxWidth: "100%",
                      fontSize: 12,
                      display: "block",
                    }}
                  >
                    {roleName}
                  </Text>
                </Tooltip>
              )}
            </div>
            <Divider style={{ padding: 0, margin: 0 }} />
          </>
        )}
        <Button
          variant="outlined"
          style={{
            width: "100%",
            borderColor: "var(--primary)",
            color: "var(--primary)",
            borderRadius: 9999,
          }}
          onClick={() =>
            navigate({
              to: APP_ROUTES.PROFILE,
              search: { userId: user.id.toString() },
            })
          }
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
};

export default FeedProfile;
