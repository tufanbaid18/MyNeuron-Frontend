import { createRoute } from "@tanstack/react-router";
import z from "zod";
import ImpulseFeed from "../pages/impulse/ImpulseFeed";
import ImpulseFeedRoot from "../pages/impulse/ImpulseFeedRoot";
import ImpulsePostDetails from "../pages/impulse/ImpulsePostDetails";
import ImpulseRoot from "../pages/impulse/ImpulseRoot";
import MyActivity from "../pages/impulse/MyActivity";
import AllPages from "../pages/impulse/pages/AllPages";
import PageDetails from "../pages/impulse/pages/PageDetails";
import PagesRoot from "../pages/impulse/pages/PagesRoot";
import { FeedPostType, MyActivityTypes } from "../types/impulse/feed.types";
import { PageOverviewTypes } from "../types/impulse/page.types";
import { appRoute } from "./app.routes";
import { ROUTER_ROUTES } from "./routes";

export const impulseRootRoute = createRoute({
  getParentRoute: () => appRoute,
  path: ROUTER_ROUTES.IMPULSE,
  component: () => <ImpulseRoot />,
});

export const impulseFeedRootRoute = createRoute({
  getParentRoute: () => impulseRootRoute,
  path: ROUTER_ROUTES.IMPULSE_FEED,
  component: () => <ImpulseFeedRoot />,
});

export const impulseFeedRoute = createRoute({
  getParentRoute: () => impulseFeedRootRoute,
  path: "/",
  component: () => <ImpulseFeed />,
});

export const impulsePostDetailsRoute = createRoute({
  getParentRoute: () => impulseFeedRootRoute,
  path: ROUTER_ROUTES.POST_DETAILS,
  params: {
    parse: (params: Record<string, string>) => ({
      postId: params.postId,
      post_type: params.post_type as FeedPostType,
    }),
    stringify: (params: { postId: string; post_type: FeedPostType }) => ({
      postId: params.postId,
      post_type: params.post_type as FeedPostType,
    }),
  },
  component: () => <ImpulsePostDetails />,
});

export const impulseActivityRoute = createRoute({
  getParentRoute: () => impulseRootRoute,
  path: ROUTER_ROUTES.ACTIVITY,
  validateSearch: z.object({
    filter: z.enum(MyActivityTypes),
  }),
  component: () => <MyActivity />,
});

export const impulsePagesRoot = createRoute({
  getParentRoute: () => impulseRootRoute,
  path: ROUTER_ROUTES.PAGES,
  component: () => <PagesRoot />,
});

export const impulseAllPagesRoute = createRoute({
  getParentRoute: () => impulsePagesRoot,
  path: "/",
  validateSearch: z.object({
    filter: z
      .enum(PageOverviewTypes)
      .optional()
      .default(PageOverviewTypes.ALL_PAGES),
  }),
  errorComponent: ({ error }) => {
    return (
      <div className="bg-white p-6 rounded-md shadow-sm">
        Something went wrong
        <div className="text-red-500">{error.message}</div>
      </div>
    );
  },
  component: () => <AllPages />,
});

export const impulsePageDetailsRoute = createRoute({
  getParentRoute: () => impulsePagesRoot,
  path: ROUTER_ROUTES.PAGE_DETAILS,
  params: {
    parse: (params: Record<string, string>) => ({
      pageId: params.pageId,
    }),
    stringify: (params: { pageId: string }) => ({
      pageId: params.pageId,
    }),
  },
  component: () => <PageDetails />,
});
