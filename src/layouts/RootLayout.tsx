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
    return pathname.includes("/impulse/feed") || pathname.includes("/inbox");
  }, [pathname]);

  return (
    <Layout className="w-full h-screen overflow-hidden">
      <RootHeader setSidebarVisible={setSidebarVisible} />
      <Layout className="relative overflow-hidden">
        {!hideSidebar && (
          <Sidebar
            sidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
            SIDEBAR_WIDTH={SIDEBAR_WIDTH}
            MD_BREAKPOINT={MD_BREAKPOINT}
          />
        )}
        <Content className="p-2 overflow-y-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default RootLayout;
