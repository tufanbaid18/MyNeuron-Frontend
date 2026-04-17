import { Menu, Drawer } from "antd";
import Sider from "antd/es/layout/Sider";
import type { SetStateAction } from "jotai";
import { useEffect, useState, useMemo, type Dispatch } from "react";
import { useLocation } from "@tanstack/react-router";
import { APP_ROUTES } from "../../constants/app.routes";
import { SIDEBAR_MENU_ITEMS } from "../../constants/sidebar.constants";
import { useTheme } from "../../providers/useTheme";
import { useUserProfile } from "../../hooks/auth/useUserProfile";
import { RegisteredEventPaymentStatus } from "../../types/user/user.types";

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
  const user = useUserProfile().data;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < MD_BREAKPOINT : false,
  );

  // Auto-hide sidebar when viewport shrinks below md and update isMobile state
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => {
      setSidebarVisible(e.matches);
      setIsMobile(!e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [MD_BREAKPOINT, setSidebarVisible]);

  const location = useLocation();
  const pathname = location.pathname;

  const { selectedKeys, openKeys } = useMemo(() => {
    // Specific child routes must check first
    if (pathname.includes(APP_ROUTES.GATC_PROGRAMS))
      return { selectedKeys: ["2a1"], openKeys: ["2", "2a"] };
    if (pathname.includes(APP_ROUTES.GATC_SPEAKERS))
      return { selectedKeys: ["2a2"], openKeys: ["2", "2a"] };
    if (pathname.includes(APP_ROUTES.GATC_PARTICIPANTS))
      return { selectedKeys: ["2a3"], openKeys: ["2", "2a"] };
    if (pathname.includes(APP_ROUTES.GATC_MY_HANDSHAKES))
      return { selectedKeys: ["2a4"], openKeys: ["2", "2a"] };

    // General GATC route
    if (pathname.includes(APP_ROUTES.GATC))
      return { selectedKeys: ["2a"], openKeys: ["2"] };

    // Other parent routes
    if (pathname.includes(APP_ROUTES.MY_BOOKSHELF))
      return { selectedKeys: ["3"], openKeys: [] };
    if (pathname.includes(APP_ROUTES.IMPULSE))
      return { selectedKeys: ["4"], openKeys: [] };

    // Default dashboard
    return { selectedKeys: ["1"], openKeys: [] };
  }, [pathname]);

  const showGatc = useMemo(() => {
    if (user) {
      return (
        user.registered_events.find(
          (event) =>
            event.payment_status === RegisteredEventPaymentStatus.PAID ||
            event.payment_status ===
              RegisteredEventPaymentStatus.MANUAL_VERIFIED,
        ) !== undefined
      );
    }
    return false;
  }, [user]);

  const menuContent = (
    <Menu
      theme={dark ? "dark" : "light"}
      mode="inline"
      className="bg-background! h-full border-r-0"
      selectedKeys={selectedKeys}
      defaultOpenKeys={openKeys}
      items={SIDEBAR_MENU_ITEMS({ gatcActive: showGatc })}
    />
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        title={
          <div className="flex items-center">
            <img src="/header_logo.png" alt="logo" className="h-8" />
          </div>
        }
        closable={true}
        onClose={() => setSidebarVisible(false)}
        open={sidebarVisible}
        size={SIDEBAR_WIDTH}
        styles={{
          body: { padding: 0 },
        }}
        classNames={{
          header: "border-b border-gray-200 dark:border-gray-800",
          body: "dark:bg-gray-900",
        }}
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
