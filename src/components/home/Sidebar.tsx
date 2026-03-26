import { Menu, Drawer } from "antd";
import Sider from "antd/es/layout/Sider";
import type { SetStateAction } from "jotai";
import { useEffect, useState, type Dispatch } from "react";
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

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < MD_BREAKPOINT : false);

  // Auto-hide sidebar when viewport shrinks below md and update isMobile state
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => {
      setSidebarVisible(e.matches);
      setIsMobile(!e.matches);
    };
    // Ensure initial check explicitly aligns
    if (mql.matches && isMobile) {
      setIsMobile(false);
    }
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [MD_BREAKPOINT, isMobile]);

  const menuContent = (
    <Menu
      theme={dark ? "dark" : "light"}
      mode="inline"
      className="bg-background! h-full border-r-0"
      defaultSelectedKeys={["1"]}
      items={SIDEBAR_MENU_ITEMS}
    />
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setSidebarVisible(false)}
        open={sidebarVisible}
        width={SIDEBAR_WIDTH}
        styles={{ body: { padding: 0 } }}
        className="dark:bg-gray-900"
      >
        {menuContent}
      </Drawer>
    );
  }

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
      {menuContent}
    </Sider>
  );
};

export default Sidebar;
