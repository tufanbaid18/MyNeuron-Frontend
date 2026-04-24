import { SendOutlined } from "@ant-design/icons";
import { Spin, Typography } from "antd";
import { forwardRef, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../../types/inbox/inbox.types";
import { MessageBubble } from "./MessageBubble";

const { Text } = Typography;

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: number;
  isLoading?: boolean;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, currentUserId, isLoading }, ref) => {
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = el;
        setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 150);
      };

      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToBottom = (smooth = true) => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    useEffect(() => {
      if (!isLoading && messages.length > 0) {
        scrollToBottom(true);
      }
    }, [messages, isLoading]);

    if (isLoading) {
      return (
        <div className="flex min-h-0 flex-1 items-center justify-center py-12">
          <Spin />
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-slate-400">
          <SendOutlined className="mb-3 text-4xl text-slate-300" />
          <Text className="text-slate-400">
            No messages yet. Start the conversation!
          </Text>
        </div>
      );
    }

    return (
      <div className="relative min-h-0 flex-1">
        <div
          ref={containerRef}
          className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto bg-slate-50/50 px-5 py-4"
        >
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              isMe={m.sender === currentUserId}
            />
          ))}
          <div ref={ref} />
        </div>

        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom()}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-colors hover:bg-emerald-500"
            aria-label="Scroll to bottom"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3v10M3 8l5 5 5-5" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

ChatMessages.displayName = "ChatMessages";
