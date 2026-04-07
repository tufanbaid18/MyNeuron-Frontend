// ════════════════════════════════════════════════════════════════
// Handshake — Types & Enums
// ════════════════════════════════════════════════════════════════

export enum HandshakeStatus {
  NONE = "none",
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum HandshakeDirection {
  SENT = "sent",
  RECEIVED = "received",
}

export type Handshake = {
  id: number;
  sender: number;
  receiver: number;
  status: HandshakeStatus;
  direction: HandshakeDirection;
  created_at: string;
};

export type CreateHandshakePayload = {
  receiver_id: number;
};
