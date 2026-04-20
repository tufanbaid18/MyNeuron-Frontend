import { useMutation } from "@tanstack/react-query";
import { createPage } from "../../services/impulse/impulse.service";
import type { CreatePagePayload } from "../../types/impulse/page.types";

export const useCreatePage = (
  options?: Parameters<typeof useMutation<unknown, unknown, CreatePagePayload>>[0],
) => {
  return useMutation({
    mutationFn: createPage,
    ...options,
  });
};
