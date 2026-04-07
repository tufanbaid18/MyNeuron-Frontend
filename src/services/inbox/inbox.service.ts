import { API_ROUTES } from "../../constants/api.routes";
import axiosInstance from "../../lib/axiosInstance";
import type {
  ChatMessage,
  Conversation,
  ConversationUser,
  SendMessagePayload,
} from "../../types/inbox/inbox.types";

// ════════════════════════════════════════════════════════════════
// Inbox / Messaging — Service Layer
// ════════════════════════════════════════════════════════════════

/** GET /conversations/ — list all conversations */
export const getConversations = async (): Promise<Conversation[]> => {
  const res = await axiosInstance.get<Conversation[]>(API_ROUTES.CONVERSATIONS);
  return res.data;
};

/** GET /messages/chat/:userId/ — get chat history with a user */
export const getChatHistory = async (
  userId: number,
): Promise<ChatMessage[]> => {
  const res = await axiosInstance.get<ChatMessage[]>(
    API_ROUTES.MESSAGES_CHAT(userId),
  );
  return res.data;
};

/** POST /messages/ — send a message */
export const sendMessage = async (
  payload: SendMessagePayload,
): Promise<ChatMessage> => {
  const res = await axiosInstance.post<ChatMessage>(
    API_ROUTES.MESSAGES_SEND,
    payload,
  );
  return res.data;
};

/** POST /messages/mark-read/:userId/ — mark all messages from user as read */
export const markChatAsRead = async (userId: number): Promise<void> => {
  await axiosInstance.post(API_ROUTES.MESSAGES_MARK_READ(userId));
};

/** GET /users/:id/ — fetch a public user profile by ID */
export const getUserById = async (
  userId: number,
): Promise<ConversationUser> => {
  const res = await axiosInstance.get<ConversationUser>(
    API_ROUTES.USER_BY_ID(userId),
  );
  return res.data;
};
