import { useNavigate } from "@tanstack/react-router";
import { Button, Input, Popover } from "antd";
import { Header } from "antd/es/layout/layout";
import { useAtomValue } from "jotai";
import {
  useState,
  type Dispatch,
  type SetStateAction,
  useRef,
  useEffect,
} from "react";
import {
  BiArrowBack,
  BiGridAlt,
  BiMenu,
  BiMessageSquareDots,
} from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { GoBook, GoHome, GoPulse } from "react-icons/go";
import { APP_ROUTES } from "../../constants/app.routes";
import { useFetchNotifications } from "../../hooks/notification/useNotifications";
import { useConversations } from "../../hooks/inbox/useInbox";
import { userProfileAtom } from "../../store/auth.store";
import { NotificationBell } from "../notifications/NotificationBell";
import HeaderProfile from "./HeaderProfile";
import { useUserSearch } from "../../hooks/user/useUserProfile";
import { useDebounce } from "../../hooks/useDebounce";
import UserSearchDropdown from "../ui/UserSearchDropdown";
import type { UserProfile } from "../../types/user/user.types";

const RootHeader = ({
  setSidebarVisible,
}: {
  setSidebarVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [navPopoverOpen, setNavPopoverOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const { data: searchedUserList = [], isLoading: isSearching } =
    useUserSearch(debouncedSearchQuery);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = useAtomValue(userProfileAtom);
  const navigate = useNavigate();

  const { data: notifications = [] } = useFetchNotifications(user?.id);
  const hasUnread = notifications.some((n) => !n.read);

  const { data: conversations = [] } = useConversations();
  const unreadConversations = conversations.filter(
    (c) => c.unread_count > 0,
  ).length;

  const navItems = [
    { label: "Home", icon: <GoHome />, route: APP_ROUTES.PLASMA },
    { label: "Impulse", icon: <GoPulse />, route: APP_ROUTES.IMPULSE_FEED },
    { label: "Bookshelf", icon: <GoBook />, route: APP_ROUTES.MY_BOOKSHELF },
  ] as const;

  const handleNavClick = (route: string) => {
    setNavPopoverOpen(false);
    navigate({ to: route });
  };

  const handleSearchedUserClick = (user: UserProfile) => {
    navigate({ to: APP_ROUTES.USER, params: { userId: user.id } });
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const navIconBtn =
    "rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

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
        ref={searchRef}
        className={`flex-1 mx-2 sm:max-w-sm gap-2 items-center relative ${
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
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
          prefix={<FiSearch />}
          autoFocus={mobileSearchOpen}
          className="w-full"
        />

        {showSearchResults && searchQuery.trim().length > 0 && (
          <UserSearchDropdown
            isSearching={isSearching}
            searchedUserList={searchedUserList}
            onUserClick={handleSearchedUserClick}
          />
        )}
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

        {/* Mobile nav popover – visible below md */}
        <Popover
          trigger="click"
          open={navPopoverOpen}
          onOpenChange={setNavPopoverOpen}
          placement="bottomRight"
          arrow={false}
          content={
            <div className="flex flex-col gap-1 min-w-[160px]">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.route)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-left"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              {/* Inbox with badge */}
              <button
                onClick={() => handleNavClick(APP_ROUTES.INBOX)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-left"
              >
                <span className="relative">
                  <BiMessageSquareDots className="text-base" />
                  {unreadConversations > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[14px] h-3.5 px-1 text-[9px] font-semibold rounded-full bg-red-500 text-white leading-none">
                      {unreadConversations > 99 ? "99+" : unreadConversations}
                    </span>
                  )}
                </span>
                Inbox
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              <div onClick={() => setNavPopoverOpen(false)}>
                <NotificationBell />
              </div>
            </div>
          }
        >
          <button className={`md:hidden relative ${navIconBtn}`}>
            <BiGridAlt size={18} />
            {hasUnread && (
              <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
        </Popover>

        {/* Desktop nav icons – visible at md+ */}
        <div className="hidden md:flex gap-2 items-center">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={navIconBtn}
              onClick={() => navigate({ to: item.route })}
            >
              {item.icon}
            </button>
          ))}

          {/* Inbox — absolute badge so the icon button stays perfectly circular */}
          <button
            className={`relative ${navIconBtn}`}
            onClick={() => navigate({ to: APP_ROUTES.INBOX })}
          >
            <BiMessageSquareDots />
            {unreadConversations > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-semibold rounded-full bg-red-500 text-white leading-none">
                {unreadConversations > 99 ? "99+" : unreadConversations}
              </span>
            )}
          </button>

          <NotificationBell />
        </div>

        {user && <HeaderProfile user={user} />}
      </div>
    </Header>
  );
};

export default RootHeader;
