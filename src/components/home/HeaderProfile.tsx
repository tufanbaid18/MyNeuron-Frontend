import { useNavigate } from "@tanstack/react-router";
import { Avatar, Dropdown } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiChevronDown, BiSolidMoon, BiSolidSun } from "react-icons/bi";
import { APP_ROUTES } from "../../constants/app.routes";
import { getHeaderProfileItems } from "../../constants/root.constants";
import { useTheme } from "../../providers/useTheme";
import { logout } from "../../services/auth/auth.service";
import type { UserProfile } from "../../types/user/user.types";
import { getAvatarByName } from "../../utils/avatar.utils";

export type HeaderProfileProps = {
  user: UserProfile;
};

const HeaderProfile: React.FC<HeaderProfileProps> = ({ user }) => {
  const { toggleTheme, dark } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: APP_ROUTES.LOGIN });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Failed to log out!");
    }
  };

  const handleProfileClick = () => {
    navigate({
      to: APP_ROUTES.PROFILE,
      search: { userId: user.id.toString() },
    });
  };

  const theme = {
    title: dark ? "Switch to Light" : "Switch to Dark",
    icon: dark ? <BiSolidSun /> : <BiSolidMoon />,
    action: toggleTheme,
  };

  const items = getHeaderProfileItems({
    theme,
    handleLogout,
    handleProfileClick,
  });

  return (
    <Dropdown
      menu={{ items, onClick: () => setOpen(false) }}
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
    >
      <div className="hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl h-10 py-2 px-1 flex justify-center items-center gap-1 cursor-pointer ">
        <Avatar
          src={
            user.profile_image ||
            getAvatarByName({
              firstName: user.first_name,
              lastName: user.last_name,
            })
          }
        />
        <div className="hidden text-black dark:text-white lg:flex lg:justify-center lg:items-center">
          {user.first_name + " " + user.last_name}
        </div>
        <BiChevronDown className="text-black dark:text-white" />
      </div>
    </Dropdown>
  );
};

export default HeaderProfile;
