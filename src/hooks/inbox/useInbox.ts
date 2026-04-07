import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getChatHistory,
  getConversations,
  getUserById,
  markChatAsRead,
  sendMessage,
} from "../../services/inbox/inbox.service";
import type {
  ChatMessage,
  Conversation,
  SendMessagePayload,
} from "../../types/inbox/inbox.types";

// ════════════════════════════════════════════════════════════════
// Inbox — Hooks
// ════════════════════════════════════════════════════════════════

const CONVERSATIONS_KEY = ["conversations"] as const;
const CHAT_HISTORY_KEY = "chatHistory";

/** Fetch all conversations for the inbox sidebar */
export const useConversations = () => {
  return useQuery({
    queryKey: CONVERSATIONS_KEY,
    queryFn: getConversations,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
};

/** Fetch chat history with a specific user */
export const useChatHistory = (userId: number | null) => {
  return useQuery({
    queryKey: [CHAT_HISTORY_KEY, userId],
    queryFn: () => getChatHistory(userId!),
    enabled: !!userId,
  });
};

/** Send a message to a user — updates chat cache optimistically */
export const useSendMessage = (activeUserId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
    onSuccess: (newMessage: ChatMessage) => {
      // Append to chat history cache
      queryClient.setQueryData(
        [CHAT_HISTORY_KEY, activeUserId],
        (old: ChatMessage[] = []) => [...old, newMessage],
      );
      // Refresh conversations list
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
      queryClient.invalidateQueries({
        queryKey: [CHAT_HISTORY_KEY, activeUserId],
      });
    },
    onError: (error) => {
      toast.error(
        `Failed to send message: ${error.message || "Please try again."}`,
      );
    },
  });
};

/** Mark all messages from a user as read */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => markChatAsRead(userId),
    onSuccess: (_, userId) => {
      // Clear unread count in conversations list
      queryClient.setQueryData(
        CONVERSATIONS_KEY,
        (old: Conversation[] = []) =>
          old.map((c) =>
            c.user.id === userId ? { ...c, unread_count: 0 } : c,
          ),
      );
      // Mark messages as read in chat history
      queryClient.setQueryData(
        [CHAT_HISTORY_KEY, userId],
        (old: ChatMessage[] | undefined) =>
          Array.isArray(old)
            ? old.map((m) => ({ ...m, is_read: true }))
            : old,
      );
    },
  });
};

/** Fetch a public user by ID (for virtual conversations) */
export const useUserById = (userId: number | null) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });
};
