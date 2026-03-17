import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { CgDarkMode } from "react-icons/cg";

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
