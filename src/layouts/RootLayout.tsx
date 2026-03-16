import { Outlet } from "@tanstack/react-router";
import { Button, Input, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { BiArrowBack, BiMenu, BiMessageSquareDots } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { GoBook, GoHome, GoPulse } from "react-icons/go";
import { RiNotification3Line } from "react-icons/ri";
import HeaderProfile from "../components/home/HeaderProfile";
import { sidebarMenuItems } from "../constants/root.constants";
import { useTheme } from "../providers/ThemeProvider";
import { userProfileAtom } from "../store/auth.store";

const SIDEBAR_WIDTH = 250;

const MD_BREAKPOINT = 768;

const RootLayout = () => {
  const { dark } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(
    () => window.innerWidth >= MD_BREAKPOINT,
  );
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const user = useAtomValue(userProfileAtom);

  // Auto-hide sidebar when viewport shrinks below md
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setSidebarVisible(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <Layout className="w-full h-full">
      {/* ── Header ── */}
      <Header
        className="border-b border-gray-200 dark:border-gray-800 shadow-lg flex items-center justify-between gap-2"
        style={{ padding: "0 12px" }}
      >
        {/* Left: menu toggle + logo */}
        <div
          className={`gap-2 items-center shrink-0 ${
            mobileSearchOpen ? "hidden sm:flex" : "flex"
          }`}
        >
          <Button
            type="text"
            icon={<BiMenu size={18} />}
            onClick={() => setSidebarVisible((v) => !v)}
          />
          <img src="/header_logo.png" alt="logo" className="h-8 sm:h-10" />
        </div>

        {/* Center: search */}
        <div
          className={`flex-1 mx-2 sm:max-w-sm gap-2 items-center ${
            mobileSearchOpen ? "flex" : "hidden sm:flex"
          }`}
        >
          {mobileSearchOpen && (
            <Button
              type="text"
              icon={<BiArrowBack size={20} />}
              onClick={() => setMobileSearchOpen(false)}
              className="sm:hidden px-0"
            />
          )}
          <Input
            size="large"
            placeholder="Search users"
            prefix={<FiSearch />}
            autoFocus={mobileSearchOpen}
            onBlur={() => setMobileSearchOpen(false)}
            className="w-full"
          />
        </div>

        {/* Right: actions + profile */}
        <div
          className={`items-center gap-2 sm:gap-4 shrink-0 ${
            mobileSearchOpen ? "hidden sm:flex" : "flex"
          }`}
        >
          {/* Mobile Search Toggle Icon */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="sm:hidden rounded-full border border-gray-500 dark:border-gray-600 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center h-8 w-8"
          >
            <FiSearch size={16} />
          </button>

          {/* Nav icons – hidden below md */}
          <div className="hidden md:flex gap-2 items-center">
            <button className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <GoHome />
            </button>
            <button className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <GoPulse />
            </button>
            <button className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <GoBook />
            </button>
            <button className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <BiMessageSquareDots />
            </button>
            <button className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <RiNotification3Line />
            </button>
          </div>

          {user && <HeaderProfile user={user} />}
        </div>
      </Header>

      {/* ── Body ── */}
      <Layout className="relative">
        {/* Sidebar: fully hidden (width 0) or shown (width 250) */}
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
            defaultSelectedKeys={["1"]}
            items={sidebarMenuItems}
          />
        </Sider>

        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default RootLayout;
