import { PlusOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "@tanstack/react-router";
import { Button, Empty, Spin, Typography } from "antd";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useChatHistory,
  useConversations,
  useMarkAsRead,
  useSendMessage,
  useUserById,
} from "../../hooks/inbox/useInbox";
import { useUnreadBadge } from "../../hooks/inbox/useUnreadBadge";
import { userProfileAtom } from "../../store/auth.store";
import type { Conversation } from "../../types/inbox/inbox.types";
import { ChatWindow } from "../../components/inbox/ChatWindow";
import { ConversationItem } from "../../components/inbox/ConversationItem";
import { NewChatModal } from "../../components/inbox/NewChatModal";
import { InboxOutlined } from "@ant-design/icons";
import { ChevronLeft } from "lucide-react";

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

  // ── Auth & Local state ──────────────────────────────────────
  const currentUser = useAtomValue(userProfileAtom);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [newChatOpen, setNewChatOpen] = useState(false);

  // ── Tab badge ─────────────────────────────────────────────
  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unread_count, 0),
    [conversations],
  );
  useUnreadBadge(totalUnread);

  // ── Derive active conversation ────────────────────────────
  const active = useMemo<Conversation | null>(() => {
    if (!parsedUserId) return null;

    const existing = conversations.find((c) => c.user.id === parsedUserId);
    if (existing) return existing;

    if (fetchedUser) {
      return {
        user: {
          id: fetchedUser.id,
          email: fetchedUser.email,
          title: fetchedUser.title,
          first_name: fetchedUser.first_name,
          middle_name: fetchedUser.middle_name,
          last_name: fetchedUser.last_name,
          profile_title: fetchedUser.profile_title,
          profile_image: fetchedUser.profile_image,
          role: fetchedUser.title || "",
          is_verified: fetchedUser.is_verified,
          is_verified_lite: false,
        },
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

  // ── Send message handler ──────────────────────────────────
  const handleSend = (content: string) => {
    if (!active) return;
    sendMsg.mutate(
      { receiver: active.user.id, content },
      {
        onSuccess: () =>
          chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      },
    );
  };

  // ── Navigate to a conversation ───────────────────────────
  const navigateToConversation = (targetUserId: number) => {
    router.navigate({ to: `/inbox/${targetUserId}`, replace: true });
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <>
      <NewChatModal
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onSelectUser={(id) => navigateToConversation(id)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden bg-white">
        {/* ─── LEFT: Conversation List ────────────────────────── */}
        <div
          className={`flex w-full flex-col border-r border-slate-200 md:w-80 md:shrink-0 ${
            active ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-2">
            <div className="flex items-center gap-3 py-4">
              <ChevronLeft
                onClick={() => router.history.back()}
                className="cursor-pointer hover:text-primary"
              />
              <div className="flex items-center gap-2">
                <InboxOutlined className="text-xl text-emerald-600" />
                <Title level={5} className="mb-0! text-slate-800">
                  Inbox
                </Title>
              </div>
            </div>
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={() => setNewChatOpen(true)}
              className="mr-2"
              title="New Chat"
            />
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
              conversations.map((c) => (
                <ConversationItem
                  key={c.user.id}
                  conversation={c}
                  isActive={parsedUserId === c.user.id}
                  onClick={() => navigateToConversation(c.user.id)}
                />
              ))
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
            <ChatWindow
              user={active.user}
              messages={chat}
              currentUserId={currentUser?.id ?? 0}
              onBack={() => router.navigate({ to: "/inbox", replace: true })}
              onSend={handleSend}
              isLoading={chatLoading}
              isSending={sendMsg.isPending}
            />
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
    </>
  );
};

export default Inbox;
