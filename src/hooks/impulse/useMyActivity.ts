import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getMyActivityOverview } from "../../services/impulse/impulse.service";
import { removeFollower, unfollowUser } from "../../services/impulse/myactivity.service";
import {
  acceptFollowRequest,
  getMyFollowers,
  getMyFollowing,
  incomingFollowRequests,
  outgoingFollowRequests,
  rejectFollowRequest,
  sendFollowRequest,
} from "../../services/user/user.service";
import type {
  MyActivityUserResponse,
  UserMiniProfile,
} from "../../types/impulse/myactivity.types";

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
      toast.success("Follow request sent successfully");
      queryClient.invalidateQueries({
        queryKey: ["outgoingFollowRequests"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send follow request");
      console.log(error);
    },
  });
};

export const useGetMyFollowing = () => {
  return useQuery<UserMiniProfile[]>({
    queryKey: ["getMyFollowing"],
    queryFn: getMyFollowing,
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
      queryClient.invalidateQueries({
        queryKey: ["getMyFollowing"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-activity-overview"],
      });
      toast.success("Follow request accepted successfully");
      queryClient.invalidateQueries({
        queryKey: ["incomingFollowRequests"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to accept follow request");
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
      toast.error(error.message || "Failed to reject follow request");
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
  return useQuery<UserMiniProfile[]>({
    queryKey: ["getMyFollowers", userId],
    queryFn: () => getMyFollowers(userId),
  });
};

export const useRemoveFollower = () => {
  const queryClient = useQueryClient();
  return useMutation<{ detail: string }, Error, number>({
    mutationFn: (follower: number) => removeFollower(follower),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getMyFollowers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getMyFollowing"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-activity-overview"],
      });
      toast.success("Follower removed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove follower");
      console.log(error);
    },
  });
};


export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation<{ detail: string }, Error, number>({
    mutationFn: (userId: number) => unfollowUser(userId),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getMyFollowing"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-activity-overview"],
      });
      toast.success("User unfollowed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unfollow user");
      console.log(error);
    },
  });
};