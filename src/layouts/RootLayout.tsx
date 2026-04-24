import { Outlet, useLocation } from "@tanstack/react-router";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useMemo, useState } from "react";
import RootHeader from "../components/home/Header";
import Sidebar from "../components/home/Sidebar";

const SIDEBAR_WIDTH = 250;

const MD_BREAKPOINT = 768;

const RootLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(
    () => window.innerWidth >= MD_BREAKPOINT,
  );

  const { pathname } = useLocation();

  const hideSidebar = useMemo(() => {
    return pathname.includes("/impulse") || pathname.includes("/inbox");
  }, [pathname]);

  return (
    <Layout className="h-screen w-full">
      <RootHeader setSidebarVisible={setSidebarVisible} />
      <Layout className="relative min-h-0 flex-1">
        {!hideSidebar && (
          <Sidebar
            sidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
            SIDEBAR_WIDTH={SIDEBAR_WIDTH}
            MD_BREAKPOINT={MD_BREAKPOINT}
          />
        )}
        <Content
          className={`flex min-h-0 flex-1 flex-col ${
            pathname.includes("/inbox")
              ? "h-full"
              : "h-full overflow-y-auto p-2"
          }`}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default RootLayout;
