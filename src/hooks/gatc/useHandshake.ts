import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  cancelHandshake,
  createHandshake,
  getMyHandshakes,
} from "../../services/gatc/handshake.service";
import type { CreateHandshakePayload } from "../../types/gatc/handshake.types";

// ════════════════════════════════════════════════════════════════
// Handshake — Hooks
// ════════════════════════════════════════════════════════════════

const HANDSHAKES_QUERY_KEY = ["handshakes"] as const;

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

/** Cancel a pending handshake */
export const useCancelHandshake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelHandshake(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HANDSHAKES_QUERY_KEY });
      toast.success("Handshake cancelled.");
    },
    onError: (error) => {
      toast.error(
        `Failed to cancel handshake: ${error.message || "Please try again."}`,
      );
    },
  });
};
