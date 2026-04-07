import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getGatcParticipants,
  getGatcPrograms,
  getGatcSpeakerById,
  getGatcSpeakers,
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

export const useGatcSpeakers = () => {
  return useQuery({
    queryKey: ["gatc-speakers"],
    queryFn: () => getGatcSpeakers(),
  });
};

export const useGatcSpeakerById = (id: number | string) => {
  return useQuery({
    queryKey: ["gatc-speaker", id],
    queryFn: () => getGatcSpeakerById(id),
    enabled: !!id,
  });
};

export const useGatcParticipants = () => {
  return useQuery({
    queryKey: ["gatc-participants"],
    queryFn: () => getGatcParticipants(),
  });
};
