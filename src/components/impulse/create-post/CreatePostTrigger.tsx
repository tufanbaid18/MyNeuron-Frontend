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
    <Avatar src={user.profile_image} size={48} />
  ) : (
    <Avatar size={48} className="bg-primary text-white font-semibold">
      {user?.first_name?.[0]}
      {user?.last_name?.[0]}
    </Avatar>
  );

  return (
    <Card
      className="mb-3 cursor-pointer hover:border-primary transition-colors"
      onClick={onOpen}
    >
      <div className="flex items-center gap-3">
        {userAvatar}
        <Input
          readOnly
          placeholder="Start a post"
          className="rounded-full cursor-pointer"
          onClick={onOpen}
        />
      </div>
      <div className="flex justify-around mt-3 px-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTabChange("image");
            onOpen();
          }}
          className="p-3 rounded-full bg-gray-200 flex justify-center items-center"
        >
          <Image className="w-8 h-8 text-primary" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTabChange("video");
            onOpen();
          }}
          className="p-3 rounded-full bg-gray-200 flex justify-center items-center"
        >
          <Video className="w-8 h-8 text-[#dc3545]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTabChange("article");
            onOpen();
          }}
          className="p-3 rounded-full bg-gray-200 flex justify-center items-center"
        >
          <RiArticleLine className="w-8 h-8 text-[#ffc117]" />
        </button>
      </div>
    </Card>
  );
};
