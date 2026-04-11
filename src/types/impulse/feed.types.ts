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
