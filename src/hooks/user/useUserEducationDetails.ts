import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addEducation,
  deleteEducation,
  getEducationList,
  updateEducation,
} from "../../services/user/user.service";

export const useEducationList = () => {
  return useQuery({
    queryKey: ["education"],
    queryFn: getEducationList,
  });
};

export const useAddEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });
};
