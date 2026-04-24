import { LinkOutlined } from "@ant-design/icons";
import { useRouter } from "@tanstack/react-router";
import type { ChatMessage } from "../../types/inbox/inbox.types";

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Match internal post links like /impulse/feed/posts/123 or full URLs containing that path */
const POST_LINK_REGEX = /(?:https?:\/\/[^\s/]+)?(\/impulse\/feed\/posts\/(\d+))/;

const extractPostLink = (
  content: string,
): { fullUrl: string; path: string; postId: string } | null => {
  const match = content.match(POST_LINK_REGEX);
  if (!match) return null;
  return {
    fullUrl: match[0],
    path: match[1],
    postId: match[2],
  };
};

export const MessageBubble = ({ message, isMe }: MessageBubbleProps) => {
  const router = useRouter();
  const postLink = extractPostLink(message.content);

  // Check if the entire message is essentially just the post link
  const isPostShareOnly = postLink && message.content.trim() === postLink.fullUrl;

  const handlePostClick = () => {
    if (postLink) {
      router.navigate({ to: postLink.path });
    }
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
          isMe
            ? "rounded-br-md bg-emerald-600 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {/* If it's purely a shared post link, show the preview card */}
        {isPostShareOnly ? (
          <button
            onClick={handlePostClick}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 bg-transparent p-0 text-left transition-opacity hover:opacity-80"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                isMe ? "bg-emerald-500/30" : "bg-emerald-100"
              }`}
            >
              <LinkOutlined
                className={`text-lg ${isMe ? "text-white" : "text-emerald-600"}`}
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <span
                className={`text-xs font-semibold ${
                  isMe ? "text-emerald-100" : "text-emerald-700"
                }`}
              >
                Shared a post
              </span>
              <span
                className={`text-xs underline ${
                  isMe ? "text-emerald-200" : "text-emerald-600"
                }`}
              >
                View post →
              </span>
            </div>
          </button>
        ) : (
          <>
            <p className="mb-0 wrap-anywhere">{message.content}</p>
            {/* If message contains a post link among other text, render a small preview below */}
            {postLink && (
              <button
                onClick={handlePostClick}
                className={`mt-2 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 p-2 text-left transition-opacity hover:opacity-80 ${
                  isMe ? "bg-emerald-500/20" : "bg-slate-50"
                }`}
              >
                <LinkOutlined
                  className={`text-sm ${isMe ? "text-emerald-200" : "text-emerald-600"}`}
                />
                <span
                  className={`text-xs underline ${
                    isMe ? "text-emerald-200" : "text-emerald-600"
                  }`}
                >
                  View shared post →
                </span>
              </button>
            )}
          </>
        )}
        <p
          className={`mb-0 mt-1 text-right text-[10px] ${
            isMe ? "text-emerald-100" : "text-slate-400"
          }`}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
};
