import { useEffect, useRef } from "react";

const ORIGINAL_TITLE = document.title;

export const useUnreadBadge = (unreadCount: number) => {
  const prevCountRef = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${ORIGINAL_TITLE}`;
    } else {
      document.title = ORIGINAL_TITLE;
    }

    prevCountRef.current = unreadCount;

    return () => {
      document.title = ORIGINAL_TITLE;
    };
  }, [unreadCount]);
};
