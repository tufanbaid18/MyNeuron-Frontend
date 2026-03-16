import { BiMessageSquareDots } from "react-icons/bi";
import { GoBook, GoHome, GoPulse } from "react-icons/go";
import { RiNotification3Line } from "react-icons/ri";

export const sidebarMenuItems = [
  { key: "1", icon: <GoHome />, label: "Home" },
  { key: "2", icon: <GoPulse />, label: "Pulse" },
  { key: "3", icon: <GoBook />, label: "Book" },
  { key: "4", icon: <BiMessageSquareDots />, label: "Messages" },
  { key: "5", icon: <RiNotification3Line />, label: "Notifications" },
];

import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { CgDarkMode } from "react-icons/cg";
import type { MenuProps } from "antd";

export const getHeaderProfileItems = (
  toggleTheme: () => void,
): MenuProps["items"] => [
  {
    key: "2",
    label: "Profile",
    icon: <UserOutlined />,
  },
  {
    key: "3",
    label: "Theme",
    onClick: toggleTheme,
    icon: <CgDarkMode />,
  },
  {
    type: "divider",
  },
  {
    key: "4",
    label: "Settings",
    icon: <SettingOutlined />,
  },
];
