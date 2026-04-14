import type { ReactNode } from "react";

export enum PageOverviewTypes {
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
