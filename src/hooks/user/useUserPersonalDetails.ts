import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getPersonalDetail,
  updatePersonalDetail,
} from "../../services/user/user.service";

export const usePersonalDetail = () => {
  return useQuery({
    queryKey: ["personal-detail"],
    queryFn: getPersonalDetail,
  });
};

export const useUpdatePersonalDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePersonalDetail,
    onSuccess: (data) => {
      queryClient.setQueryData(["personal-detail"], data);
    },
    onError: (error) => {
      toast.error(
        "Failed to update personal details!" + error.message
          ? `Reason: ${error.message}`
          : "",
      );
    },
  });
};
