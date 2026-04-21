


export enum FollowingStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export type UserMiniProfile = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image_url?: string;
  profile_image?:string ;
  is_following?: boolean;
};

export type MyActivityUserResponse = {
  id: number;
  follower: UserMiniProfile;
  following: UserMiniProfile;
  status: FollowingStatus;
  created_at: string;
  responded_at: string | null;
};

