import type { ReactNode } from "react";

export enum PageOverviewTypes {
  ALL_PAGES = "all-pages",
  MY_PAGES = "my-pages",
  FOLLOWED_PAGES = "followed-pages",
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
