import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

export const getHeaderProfileItems = ({
  // theme,
  handleLogout,
  handleProfileClick,
}: {
  // theme: { title: string; icon: React.ReactNode; action: () => void };
  handleLogout: () => void;
  handleProfileClick: () => void;
}): MenuProps["items"] => [
  {
    key: "2",
    label: "Profile",
    icon: <UserOutlined />,
    onClick: handleProfileClick,
  },
  // {
  //   key: "3",
  //   label: theme.title,
  //   onClick: theme.action,
  //   icon: theme.icon,
  // },
  {
    type: "divider",
  },
  {
    key: "4",
    label: "Log Out",
    className: "hover:bg-red-100! text-red-500!",
    onClick: handleLogout,
    icon: <LogoutOutlined />,
  },
];
