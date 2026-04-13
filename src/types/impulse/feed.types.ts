import type { ReactNode } from "react";

export type MyFollowersResponse = MyFollowersItem[];

export type MyFollowersItem = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  is_following: boolean;
};

export type MyFollowingResponse = MyFollowingItem[];

export type MyFollowingItem = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  is_following: boolean;
};

export type MyActivityOverview = {
  follow_requests: number;
  pending_requests: number;
  following: number;
  followers: number;
};

export enum MyActivityTypes {
  FOLLOW_REQUESTS = "follow-requests",
  PENDING_REQUESTS = "pending-requests",
  FOLLOWING = "following",
  FOLLOWERS = "followers",
}

export type MyActivityOverviewItem = {
  icon: ReactNode;
  heading: string;
  data: ReactNode;
  type: MyActivityTypes;
};
