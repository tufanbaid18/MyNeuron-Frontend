import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFollowRequest,
  getMyFollowers,
  getMyFollowing,
  incomingFollowRequests,
  outgoingFollowRequests,
  publicUserSearch,
  publicUserSearchById,
  sendFollowRequest,
  uploadProfileImage,
} from "../../services/user/user.service";
import type {
  FollowRequestResponse,
  UserProfile,
} from "../../types/user/user.types";

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      // Update user-profile cache
      queryClient.setQueryData(
        ["userProfile"],
        (
          old: import("../../types/user/user.types").UserProfile | undefined,
        ) => {
          if (!old) return old;
          return {
            ...old,
            profile_image: data.profile_image,
          };
        },
      );
    },
  });
};

export const useUserSearch = (query: string) => {
  return useQuery<UserProfile[]>({
    queryKey: ["userSearch", query],
    queryFn: () => publicUserSearch(query),
    enabled: !!query,
    // staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserSearchById = (id: number) => {
  return useQuery<UserProfile>({
    queryKey: ["userSearchById", id],
    queryFn: () => publicUserSearchById(id),
    enabled: !!id,
    // staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSendFollowRequest = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<FollowRequestResponse>({
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
  return useQuery<UserProfile[]>({
    queryKey: ["getMyFollowing"],
    queryFn: () => getMyFollowing(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAcceptFollowRequest = (requestId: string) => {
  const queryClient = useQueryClient();
  return useMutation<FollowRequestResponse>({
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

export const useOutgoingFollowRequests = () => {
  return useQuery<UserProfile[]>({
    queryKey: ["outgoingFollowRequests"],
    queryFn: () => outgoingFollowRequests(),
    // staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useIncomingFollowRequests = () => {
  return useQuery<UserProfile[]>({
    queryKey: ["incomingFollowRequests"],
    queryFn: () => incomingFollowRequests(),
    // staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetMyFollowers = (userId: number) => {
  return useQuery<UserProfile[]>({
    queryKey: ["getMyFollowers", userId],
    queryFn: () => getMyFollowers(userId),
  });
};
