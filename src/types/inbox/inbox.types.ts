// ════════════════════════════════════════════════════════════════
// Inbox / Messaging — Types
// ════════════════════════════════════════════════════════════════

export type ConversationUser = {
  id: number;
  email: string;
  title: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  profile_title: string | null;
  profile_image: string | null;
  role: string;
  is_verified: boolean;
  is_verified_lite: boolean;
};

export type ConversationLastMessage = {
  id: number;
  content: string;
  created_at: string;
  is_read: boolean;
};

export type Conversation = {
  user: ConversationUser;
  last_message: ConversationLastMessage | null;
  unread_count: number;
  /** Virtual conversations are created client-side when navigating from a speaker profile with no prior chat */
  isVirtual?: boolean;
};

export type ChatMessage = {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  is_read: boolean;
  created_at: string;
};

export type SendMessagePayload = {
  receiver: number;
  content: string;
};
