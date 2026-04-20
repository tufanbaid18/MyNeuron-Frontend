import { Button } from "antd";
import React from "react";

type SocialHandleProps = {
  icon: React.ReactNode;
  href: string;
  hoverColorClass?: string;
};

function SocialHandle({
  icon,
  href,
  hoverColorClass = "hover:!text-black dark:hover:!text-white",
}: SocialHandleProps) {
  // Ensure the link represents a valid outbound URL format
  const linkUrl = href && !href.startsWith("http") ? `https://${href}` : href;

  return (
    <a href={linkUrl} target="_blank" rel="noopener noreferrer">
      <Button
        shape="circle"
        size="large"
        className={`bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-400 shadow-sm flex items-center justify-center h-11 w-11 transition-all ${hoverColorClass}`}
      >
        {icon}
      </Button>
    </a>
  );
}

export default SocialHandle;
