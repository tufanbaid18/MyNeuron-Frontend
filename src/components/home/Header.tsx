import { useNavigate } from "@tanstack/react-router";
import { Button, Input } from "antd";
import { Header } from "antd/es/layout/layout";
import { useAtomValue } from "jotai";
import { useState, type Dispatch, type SetStateAction } from "react";
import { BiArrowBack, BiMenu, BiMessageSquareDots } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { GoBook, GoHome, GoPulse } from "react-icons/go";
import { RiNotification3Line } from "react-icons/ri";
import { APP_ROUTES } from "../../constants/app.routes";
import { userProfileAtom } from "../../store/auth.store";
import HeaderProfile from "./HeaderProfile";

const RootHeader = ({
  setSidebarVisible,
}: {
  setSidebarVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const user = useAtomValue(userProfileAtom);
  const navigate = useNavigate();
  return (
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
        <img
          src="/header_logo.png"
          alt="logo"
          className="h-8 sm:h-10"
          onClick={() => (window.location.href = APP_ROUTES.PLASMA)}
        />
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
          <button
            className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => navigate({ to: APP_ROUTES.PLASMA })}
          >
            <GoHome />
          </button>
          <button
            className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => navigate({ to: APP_ROUTES.IMPULSE_FEED })}
          >
            <GoPulse />
          </button>
          <button
            className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => navigate({ to: APP_ROUTES.MY_BOOKSHELF })}
          >
            <GoBook />
          </button>
          <button
            className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => navigate({ to: APP_ROUTES.INBOX })}
          >
            <BiMessageSquareDots />
          </button>
          <button
            className="rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => navigate({ to: APP_ROUTES.PLASMA })}
          >
            <RiNotification3Line />
          </button>
        </div>

        {user && <HeaderProfile user={user} />}
      </div>
    </Header>
  );
};

export default RootHeader;
