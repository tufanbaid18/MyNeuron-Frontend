import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyActivityOverview } from "../../services/impulse/impulse.service";
import { acceptFollowRequest, getMyFollowers, getMyFollowing, incomingFollowRequests, outgoingFollowRequests, rejectFollowRequest, sendFollowRequest } from "../../services/user/user.service";
import type { MyActivityUserResponse } from "../../types/impulse/myactivity.types";


export const useMyActivityOverview = () => {
  return useQuery({
    queryKey: ["my-activity-overview"],
    queryFn: getMyActivityOverview,
  });
};

export const useSendFollowRequest = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<MyActivityUserResponse>({
    mutationFn: () => sendFollowRequest(id),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSearchById", id] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetMyFollowing = () => {
  return useQuery<MyActivityUserResponse[]>({
    queryKey: ["getMyFollowing"],
    queryFn: () => getMyFollowing(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAcceptFollowRequest = (requestId: number) => {
  const queryClient = useQueryClient();
  return useMutation<MyActivityUserResponse[]>({
    mutationFn: () => acceptFollowRequest(requestId),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userSearchById", requestId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useRejectFollowRequest = (requestId: number) => {
  const queryClient = useQueryClient();
  return useMutation<MyActivityUserResponse[]>({
    mutationFn: () => rejectFollowRequest(requestId),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incomingFollowRequests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["userSearchById", requestId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useOutgoingFollowRequests = () => {
  return useQuery<MyActivityUserResponse[]>({
    queryKey: ["outgoingFollowRequests"],
    queryFn: () => outgoingFollowRequests(),
    // staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useIncomingFollowRequests = () => {
  return useQuery<MyActivityUserResponse[]>({
    queryKey: ["incomingFollowRequests"],
    queryFn: () => incomingFollowRequests(),
    // staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetMyFollowers = (userId: number) => {
  return useQuery<MyActivityUserResponse[]>({
    queryKey: ["getMyFollowers", userId],
    queryFn: () => getMyFollowers(userId),
  });
};
