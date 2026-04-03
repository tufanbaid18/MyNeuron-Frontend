import { useMutation } from "@tanstack/react-query";
import { getGatcPrograms } from "../../services/gatc/gatc.service";
import toast from "react-hot-toast";

export const useGatcPrograms = () => {
  return useMutation({
    mutationFn: () => getGatcPrograms(),
    onError: (error) => {
      toast.error(
        `Failed to fetch Programs: ${error.message || "Please try again."}`,
      );
    },
  });
};
