import type { ReactNode } from "react";

export enum PageOverviewTypes {
  ALL_PAGES = "all_pages",
  MY_PAGES = "my_pages",
  FOLLOWED_PAGES = "followed_pages",
}

export type PageOverviewItem = {
  icon: ReactNode;
  heading: string;
  data: ReactNode;
  type: PageOverviewTypes;
};

export type PagesOverview = {
  my_pages: number;
  followed_pages: number;
};

export enum PageCategory {
  COMPANY = "company",
  EVENT = "event",
  COMMUNITY = "community",
  GENERAL = "general",
}

export type CreatePagePayload = {
  page_name: string;
  category: PageCategory;
  bio: string;

  // Images
  cover_image?: File;
  profile_image?: File;

  // Optional location / web
  website?: string;
  state?: string;
  zip?: string;
  country?: string;

  // Company
  company_name?: string;
  official_website?: string;
  company_bio?: string;
  cin?: string;

  // Event
  event_name?: string;
  event_description?: string;
  tags?: string[];

  // Community
  community_details?: string;
};

export type PageDetails = {
  id: number;
  owner: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_following: boolean;
  };
  followers_count: number;
  is_following: boolean;
  cover_image_url: string | null;
  profile_image_url: string | null;
  page_name: string;
  category: PageCategory;
  company_name: string | null;
  official_website: string | null;
  company_bio: string | null;
  cin: string | null;
  event_name: string | null;
  event_description: string | null;
  tags: string | null;
  community_details: string | null;
  bio: string;
  cover_image: string | null;
  profile_image: string | null;
  website: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  created_at: string;
};

export type PagesByFilterResponse = PageDetails[];
