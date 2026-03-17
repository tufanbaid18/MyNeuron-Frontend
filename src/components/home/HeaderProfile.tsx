import { Avatar, Dropdown, Space } from "antd";
import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import type { UserProfile } from "../../types/user/user.types";
import { getAvatarByName } from "../../utils/avatar.utils";
import { useTheme } from "../../providers/ThemeProvider";
import { getHeaderProfileItems } from "../../constants/root.constants";

export type HeaderProfileProps = {
  user: UserProfile;
};

const HeaderProfile: React.FC<HeaderProfileProps> = ({ user }) => {
  const { toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const items = getHeaderProfileItems(toggleTheme);

  return (
    <Dropdown
      menu={{ items, onClick: () => setOpen(false) }}
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <div className="flex justify-center items-center gap-2 cursor-pointer">
            <div>
              <Avatar
                src={
                  user.profile_image ||
                  getAvatarByName({
                    firstName: user.first_name,
                    lastName: user.last_name,
                  })
                }
              />
            </div>
            <div className="hidden lg:block">
              {user.first_name + " " + user.last_name}
            </div>
          </div>
          <BiChevronDown />
        </Space>
      </a>
    </Dropdown>
  );
};

export default HeaderProfile;
