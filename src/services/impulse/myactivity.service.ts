import { API_ROUTES } from "../../constants/api.routes";
import axiosInstance from "../../lib/axiosInstance";

export const removeFollower = async (follower: number) => {
  const res = await axiosInstance.post(API_ROUTES.REMOVE_FOLLOWER, { follower });
  return res.data;
};

export const unfollowUser = async (userId: number) => {
  const res = await axiosInstance.post(API_ROUTES.UNFOLLOW_USER, { following: userId });
  return res.data;
};