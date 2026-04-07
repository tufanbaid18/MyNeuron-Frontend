import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getGatcMemberById,
  getGatcMembers,
  getGatcPrograms,
} from "../../services/gatc/gatc.service";

export const useGatcPrograms = () => {
  return useMutation({
    mutationFn: (speakerId?: number | string) => getGatcPrograms(speakerId),
    onError: (error) => {
      toast.error(
        `Failed to fetch Programs: ${error.message || "Please try again."}`,
      );
    },
  });
};

/** Unified hook to fetch members with optional role/event filter */
export const useGatcMembers = (params?: {
  role?: "speaker" | "participant";
  event?: number;
}) => {
  return useQuery({
    queryKey: ["gatc-members", params?.role, params?.event],
    queryFn: () => getGatcMembers(params),
  });
};

export const useGatcMemberById = (id: number | string) => {
  return useQuery({
    queryKey: ["gatc-member", id],
    queryFn: () => getGatcMemberById(id),
    enabled: !!id,
  });
};
