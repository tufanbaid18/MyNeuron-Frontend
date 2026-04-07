// ════════════════════════════════════════════════════════════════
// Handshake — Types & Enums
// ════════════════════════════════════════════════════════════════

export enum HandshakeStatus {
  NONE = "none",
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  CANCELLED = "cancelled",
}

export enum HandshakeDirection {
  SENT = "sent",
  RECEIVED = "received",
}

/** Nested user info returned inside each handshake object */
export type HandshakeUserDetails = {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
};

/** Raw handshake object from the API */
export type Handshake = {
  id: number;
  sender: number;
  receiver: number;
  status: HandshakeStatus;
  created_at: string;
  responded_at: string | null;
  sender_details: HandshakeUserDetails;
  receiver_details: HandshakeUserDetails;
  /** Client-side field added during merge of sent/received arrays */
  direction?: HandshakeDirection;
};

export type CreateHandshakePayload = {
  receiver_id: number;
};

/** API response shape from GET /handshake/my_handshakes/ */
export type MyHandshakesResponse = {
  sent: Handshake[];
  received: Handshake[];
};
