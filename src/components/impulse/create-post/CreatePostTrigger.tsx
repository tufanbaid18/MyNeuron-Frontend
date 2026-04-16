import { Avatar, Card, Input } from "antd";
import { Image, Video } from "lucide-react";
import { RiArticleLine } from "react-icons/ri";
import type { UserProfile } from "../../../types/user/user.types";

interface CreatePostTriggerProps {
  user: UserProfile;
  onOpen: () => void;
  onTabChange: (tab: string) => void;
}

export const CreatePostTrigger = ({
  user,
  onOpen,
  onTabChange,
}: CreatePostTriggerProps) => {
  const userAvatar = user?.profile_image ? (
    <Avatar
      src={user.profile_image}
      size={44}
      style={{ flexShrink: 0, aspectRatio: "1 / 1" }}
    />
  ) : (
    <Avatar
      size={44}
      className="bg-primary"
      style={{
        flexShrink: 0,
        aspectRatio: "1 / 1",
        color: "#fff",
        fontWeight: 600,
      }}
    >
      {user?.first_name?.[0]}
      {user?.last_name?.[0]}
    </Avatar>
  );

  return (
    <Card
      hoverable
      style={{ marginBottom: 12, cursor: "pointer" }}
      onClick={onOpen}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {userAvatar}
        <Input
          readOnly
          placeholder="Start a post"
          style={{ borderRadius: 9999, cursor: "pointer" }}
          onClick={onOpen}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 12,
          padding: "0 8px",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTabChange("image");
            onOpen();
          }}
          style={{
            padding: 10,
            borderRadius: "50%",
            backgroundColor: "#e5e7eb",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Image
            style={{
              width: 24,
              height: 24,
              color: "var(--primary)",
              flexShrink: 0,
            }}
          />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTabChange("video");
            onOpen();
          }}
          style={{
            padding: 10,
            borderRadius: "50%",
            backgroundColor: "#e5e7eb",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Video
            style={{
              width: 24,
              height: 24,
              color: "#dc3545",
              flexShrink: 0,
            }}
          />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTabChange("article");
            onOpen();
          }}
          style={{
            padding: 10,
            borderRadius: "50%",
            backgroundColor: "#e5e7eb",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <RiArticleLine
            style={{
              width: 24,
              height: 24,
              color: "#ffc117",
              flexShrink: 0,
            }}
          />
        </button>
      </div>
    </Card>
  );
};
