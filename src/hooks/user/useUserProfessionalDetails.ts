import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfessionalDetail,
  updateProfessionalDetail,
} from "../../services/user/user.service";
import toast from "react-hot-toast";

export const useProfessionalDetail = () => {
  return useQuery({
    queryKey: ["professional-detail"],
    queryFn: getProfessionalDetail,
  });
};

export const useUpdateProfessionalDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfessionalDetail,
    onSuccess: (data) => {
      queryClient.setQueryData(["professional-detail"], data);
    },
    onError: (error) => {
      toast.error(
        "Failed to update professional details!" + error.message
          ? `Reason: ${error.message}`
          : "",
      );
    },
  });
};
