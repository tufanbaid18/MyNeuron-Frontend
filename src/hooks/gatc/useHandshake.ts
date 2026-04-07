import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  acceptHandshake,
  cancelHandshake,
  createHandshake,
  declineHandshake,
  getMyHandshakes,
} from "../../services/gatc/handshake.service";
import type { CreateHandshakePayload } from "../../types/gatc/handshake.types";

// ════════════════════════════════════════════════════════════════
// Handshake — Hooks
// ════════════════════════════════════════════════════════════════

export const HANDSHAKES_QUERY_KEY = ["handshakes"] as const;

/** Fetch all handshakes (sent + received) for the logged-in user */
export const useGetMyHandshakes = () => {
  return useQuery({
    queryKey: HANDSHAKES_QUERY_KEY,
    queryFn: getMyHandshakes,
    staleTime: 1000,
    refetchOnWindowFocus: true,
  });
};

/** Send a new handshake request */
export const useCreateHandshake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHandshakePayload) => createHandshake(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HANDSHAKES_QUERY_KEY });
      toast.success("Handshake request sent!");
    },
    onError: (error) => {
      toast.error(
        `Failed to send handshake: ${error.message || "Please try again."}`,
      );
    },
  });
};

/** Cancel a pending handshake (sender only) */
export const useCancelHandshake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelHandshake(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HANDSHAKES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(
        `Failed to cancel handshake: ${error.message || "Please try again."}`,
      );
    },
  });
};

/** Accept a handshake (receiver/speaker only) */
export const useAcceptHandshake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => acceptHandshake(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HANDSHAKES_QUERY_KEY });
      toast.success("Handshake accepted!");
    },
    onError: (error) => {
      toast.error(
        `Failed to accept handshake: ${error.message || "Please try again."}`,
      );
    },
  });
};

/** Decline a handshake (receiver/speaker only) */
export const useDeclineHandshake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => declineHandshake(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HANDSHAKES_QUERY_KEY });
      toast.success("Handshake declined.");
    },
    onError: (error) => {
      toast.error(
        `Failed to decline handshake: ${error.message || "Please try again."}`,
      );
    },
  });
};
