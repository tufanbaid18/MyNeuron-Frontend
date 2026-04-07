import {
  ArrowLeftOutlined,
  InboxOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "@tanstack/react-router";
import { Avatar, Badge, Button, Empty, Input, Spin, Typography } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useChatHistory,
  useConversations,
  useMarkAsRead,
  useSendMessage,
  useUserById,
} from "../../hooks/inbox/useInbox";
import type { Conversation } from "../../types/inbox/inbox.types";
import { getAvatarByName } from "../../utils/avatar.utils";

const { Text, Title } = Typography;

// ════════════════════════════════════════════════════════════════
// Inbox Page
// ════════════════════════════════════════════════════════════════

const Inbox = () => {
  const { userId } = useParams({ strict: false });
  const router = useRouter();

  const parsedUserId = userId ? Number(userId) : null;

  // ── Data hooks ────────────────────────────────────────────
  const { data: conversations = [], isLoading: convLoading } =
    useConversations();
  const { data: fetchedUser } = useUserById(parsedUserId);
  const { data: chat = [], isLoading: chatLoading } =
    useChatHistory(parsedUserId);
  const sendMsg = useSendMessage(parsedUserId);
  const markAsRead = useMarkAsRead();

  // ── Local state ───────────────────────────────────────────
  const [text, setText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Derive active conversation ────────────────────────────
  const active = useMemo<Conversation | null>(() => {
    if (!parsedUserId) return null;

    const existing = conversations.find((c) => c.user.id === parsedUserId);
    if (existing) return existing;

    // Virtual conversation from navigating via speaker profile
    if (fetchedUser) {
      return {
        user: fetchedUser,
        last_message: null,
        unread_count: 0,
        isVirtual: true,
      };
    }

    return null;
  }, [parsedUserId, conversations, fetchedUser]);

  // ── Mark as read when conversation opens ──────────────────
  useEffect(() => {
    if (active && !active.isVirtual && active.unread_count > 0) {
      markAsRead.mutate(active.user.id);
    }
  }, [active?.user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-scroll to bottom on new messages ─────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ── Send message handler ──────────────────────────────────
  const handleSend = () => {
    if (!text.trim() || !active) return;

    sendMsg.mutate(
      { receiver: active.user.id, content: text },
      { onSuccess: () => setText("") },
    );
  };

  // ── Navigate to a conversation ────────────────────────────
  const navigateToConversation = (targetUserId: number) => {
    router.navigate({ to: `/inbox/${targetUserId}` });
  };

  // ── Render helpers ────────────────────────────────────────
  const getUserAvatar = (
    firstName: string,
    lastName: string,
    profileImage: string | null,
    size: number = 40,
  ) => (
    <Avatar
      size={size}
      src={
        profileImage ||
        getAvatarByName({ firstName, lastName })
      }
      icon={!profileImage && <UserOutlined />}
      className="shrink-0"
    />
  );

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* ─── LEFT: Conversation List ────────────────────────── */}
      <div
        className={`flex w-full flex-col border-r border-slate-200 md:w-80 md:shrink-0 ${
          active ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <InboxOutlined className="text-xl text-emerald-600" />
          <Title level={5} className="mb-0! text-slate-800">
            Inbox
          </Title>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto">
          {convLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spin />
            </div>
          ) : conversations.length === 0 ? (
            <Empty
              description="No conversations yet"
              className="py-12"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            conversations.map((c) => {
              const isActive = parsedUserId === c.user.id;
              return (
                <div
                  key={c.user.id}
                  onClick={() => navigateToConversation(c.user.id)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
                    isActive
                      ? "border-l-2 border-emerald-500 bg-emerald-50/50"
                      : ""
                  }`}
                >
                  {getUserAvatar(
                    c.user.first_name,
                    c.user.last_name,
                    c.user.profile_image,
                    42,
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <Text strong className="truncate text-sm text-slate-800">
                        {c.user.first_name} {c.user.last_name}
                      </Text>
                      {c.last_message && (
                        <Text className="shrink-0 text-xs text-slate-400">
                          {formatTime(c.last_message.created_at)}
                        </Text>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Text className="truncate text-xs text-slate-500">
                        {c.last_message?.content || "Start a conversation"}
                      </Text>
                      {c.unread_count > 0 && (
                        <Badge
                          count={c.unread_count}
                          size="small"
                          className="ml-2"
                          color="#10b981"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── RIGHT: Chat Window ─────────────────────────────── */}
      <div
        className={`flex flex-1 flex-col ${
          !active ? "hidden md:flex" : "flex"
        }`}
      >
        {active ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.navigate({ to: "/inbox" })}
                className="md:hidden"
                size="small"
              />

              {getUserAvatar(
                active.user.first_name,
                active.user.last_name,
                active.user.profile_image,
                36,
              )}

              <div>
                <Text strong className="text-slate-800">
                  {active.user.first_name} {active.user.last_name}
                </Text>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 px-5 py-4">
              {chatLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spin />
                </div>
              ) : chat.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {chat.map((m) => {
                    const isMe = m.sender !== active.user.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                            isMe
                              ? "rounded-br-md bg-emerald-600 text-white"
                              : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                          }`}
                        >
                          <p className="mb-0">{m.content}</p>
                          <p
                            className={`mb-0 mt-1 text-right text-[10px] ${
                              isMe ? "text-emerald-100" : "text-slate-400"
                            }`}
                          >
                            {formatTime(m.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                  <SendOutlined className="mb-3 text-4xl text-slate-300" />
                  <Text className="text-slate-400">
                    No messages yet. Start the conversation!
                  </Text>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-3 border-t border-slate-200 bg-white px-5 py-3">
              <Input
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPressEnter={handleSend}
                className="rounded-full"
                size="large"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={sendMsg.isPending}
                disabled={!text.trim()}
                shape="circle"
                size="large"
                className="bg-emerald-600 hover:bg-emerald-500"
              />
            </div>
          </>
        ) : (
          /* ── No conversation selected state ──────────────── */
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <InboxOutlined className="mb-4 text-6xl text-slate-300" />
            <Title level={4} className="text-slate-400!">
              Select a conversation
            </Title>
            <Text className="text-slate-400">
              Choose from your existing conversations or start a new one
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
