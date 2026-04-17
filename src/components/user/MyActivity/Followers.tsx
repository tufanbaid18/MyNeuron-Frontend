import { Avatar } from "antd";
import type { UserProfile } from "../../../types/user/user.types";
import { getAvatarByName } from "../../../utils/avatar.utils";

const Followers = ({ user }: { user: UserProfile }) => {
  return (
    <div
      //   key={user.id}
      //   onClick={() => onUserClick(user)}
      className="flex items-center gap-3 p-2 rounded-xl h-14 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group text-left w-full cursor-pointer"
    >
      <Avatar
        size={40}
        src={
          user.profile_image ||
          getAvatarByName({
            firstName: user.first_name,
            lastName: user.last_name,
          })
        }
        className="shrink-0 border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform"
      />
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
          {user.first_name} {user.last_name}
        </span>
      </div>
    </div>
  );
};

export default Followers;
