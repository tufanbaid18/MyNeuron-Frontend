import { API_ROUTES } from "../../constants/api.routes";
import axiosInstance from "../../lib/axiosInstance";
import type {
  CreateHandshakePayload,
  Handshake,
} from "../../types/gatc/handshake.types";
import { HandshakeDirection } from "../../types/gatc/handshake.types";

// ════════════════════════════════════════════════════════════════
// Handshake — Service Layer
// ════════════════════════════════════════════════════════════════

/** POST /handshake/send/ — create a handshake request */
export const createHandshake = async (
  payload: CreateHandshakePayload,
): Promise<Handshake> => {
  const res = await axiosInstance.post<Handshake>(
    API_ROUTES.HANDSHAKE_SEND,
    payload,
  );
  return res.data;
};

/** GET /handshake/my_handshakes/ — returns { sent: [], received: [] } */
export const getMyHandshakes = async (): Promise<Handshake[]> => {
  const res = await axiosInstance.get<{
    sent: Handshake[];
    received: Handshake[];
  }>(API_ROUTES.HANDSHAKE_MY);

  const payload = res.data ?? { sent: [], received: [] };

  const combined: Handshake[] = [
    ...(payload.sent ?? []).map((h) => ({
      ...h,
      direction: HandshakeDirection.SENT,
    })),
    ...(payload.received ?? []).map((h) => ({
      ...h,
      direction: HandshakeDirection.RECEIVED,
    })),
  ];

  // sort by created_at descending
  combined.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return combined;
};

/** POST /handshake/:id/cancel/ — cancel a pending handshake */
export const cancelHandshake = async (id: number): Promise<void> => {
  await axiosInstance.post(API_ROUTES.HANDSHAKE_CANCEL(id));
};
