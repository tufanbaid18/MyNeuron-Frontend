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

export const MessageBubble = ({ message, isMe }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
          isMe
            ? "rounded-br-md bg-emerald-600 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
        }`}
      >
        <p className="mb-0 wrap-anywhere">{message.content}</p>
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
