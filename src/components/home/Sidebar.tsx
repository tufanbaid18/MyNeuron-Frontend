import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import type { SetStateAction } from "jotai";
import { useEffect, type Dispatch } from "react";
import { SIDEBAR_MENU_ITEMS } from "../../constants/sidebar.constants";
import { useTheme } from "../../providers/ThemeProvider";

const Sidebar = ({
  sidebarVisible,
  setSidebarVisible,
  SIDEBAR_WIDTH,
  MD_BREAKPOINT,
}: {
  sidebarVisible: boolean;
  setSidebarVisible: Dispatch<SetStateAction<boolean>>;
  SIDEBAR_WIDTH: number;
  MD_BREAKPOINT: number;
}) => {
  const { dark } = useTheme();

  // Auto-hide sidebar when viewport shrinks below md
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setSidebarVisible(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <Sider
      width={SIDEBAR_WIDTH}
      collapsedWidth={0}
      collapsed={!sidebarVisible}
      trigger={null}
      className="border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden"
      style={{
        flex: `0 0 ${sidebarVisible ? SIDEBAR_WIDTH : 0}px`,
        maxWidth: sidebarVisible ? SIDEBAR_WIDTH : 0,
        minWidth: sidebarVisible ? SIDEBAR_WIDTH : 0,
        width: sidebarVisible ? SIDEBAR_WIDTH : 0,
      }}
    >
      <Menu
        theme={dark ? "dark" : "light"}
        mode="inline"
        className="bg-background!"
        defaultSelectedKeys={["1"]}
        items={SIDEBAR_MENU_ITEMS}
      />
    </Sider>
  );
};

export default Sidebar;
