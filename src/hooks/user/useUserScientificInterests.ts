import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getScientificInterest,
  updateScientificInterest,
} from "../../services/user/user.service";

// ----------------------------
// 🔹 Get Scientific Interest
// ----------------------------
export const useScientificInterest = () => {
  return useQuery({
    queryKey: ["scientific-interest"],
    queryFn: getScientificInterest,
  });
};

// ----------------------------
// 🔹 Update Scientific Interest
// ----------------------------
export const useUpdateScientificInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateScientificInterest,
    onSuccess: (data) => {
      queryClient.setQueryData(["scientific-interest"], data);
    },
  });
};
