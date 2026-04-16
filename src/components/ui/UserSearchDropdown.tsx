import { Avatar } from "antd";
import type { UserProfile } from "../../types/user/user.types";
import { getAvatarByName } from "../../utils/avatar.utils";

interface UserSearchDropdownProps {
  isSearching: boolean;
  searchedUserList: UserProfile[];
  onUserClick: (user: UserProfile) => void;
}

const UserSearchDropdown = ({
  isSearching,
  searchedUserList,
  onUserClick,
}: UserSearchDropdownProps) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[1000] search-results-animation">
      <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {isSearching ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Searching...
          </div>
        ) : searchedUserList.length > 0 ? (
          <div className="flex flex-col gap-1">
            {searchedUserList.map((user) => (
              <button
                key={user.id}
                onClick={() => onUserClick(user)}
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
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearchDropdown;
