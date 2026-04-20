import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Avatar, Button, Tag } from "antd";
import {
  useAcceptFollowRequest,
  useRejectFollowRequest,
} from "../../../hooks/impulse/useMyActivity";
import { MyActivityTypes } from "../../../types/impulse/feed.types";
import type { UserMiniProfile } from "../../../types/user/user.types";
import { getAvatarByName } from "../../../utils/avatar.utils";

type FollowersProps = {
  user: UserMiniProfile;
  type?: MyActivityTypes;
};

const Followers = ({ user, type }: FollowersProps) => {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  const { mutateAsync: acceptFollowRequest } = useAcceptFollowRequest(user.id);
  const { mutateAsync: rejectFollowRequest } = useRejectFollowRequest(user.id);
  // const { mutateAsync: handleUnfollowUser } = useUnfollowUser(user.id);

  const handleAcceptFollowRequest = () => {
    acceptFollowRequest();
  };

  const handleRejectFollowRequest = () => {
    rejectFollowRequest();
  };

  const renderAction = () => {
    switch (type) {
      case MyActivityTypes.FOLLOW_REQUESTS:
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleAcceptFollowRequest();
              }}
            >
              Accept
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleRejectFollowRequest();
              }}
            >
              Reject
            </Button>
          </div>
        );
      case MyActivityTypes.PENDING_REQUESTS:
        return <Tag color="orange">Pending</Tag>;
      case MyActivityTypes.FOLLOWING:
        return (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Unfollow
          </Button>
        );
      case MyActivityTypes.FOLLOWERS:
        return (
          <Button
            size="small"
            danger
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Remove
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex items-center justify-between gap-3 p-2 rounded-xl h-14 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group text-left w-full cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Avatar
          size={40}
          src={
            user.profile_image_url ||
            getAvatarByName({
              firstName: user.first_name,
              lastName: user.last_name,
            })
          }
          className="shrink-0 border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
            {fullName}
          </span>
        </div>
      </div>
      <div className="shrink-0">{renderAction()}</div>
    </div>
  );
};

export default Followers;
