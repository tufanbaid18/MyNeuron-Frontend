import { createRoute } from "@tanstack/react-router";
import z from "zod";
import ImpulseFeed from "../pages/impulse/ImpulseFeed";
import ImpulseFeedRoot from "../pages/impulse/ImpulseFeedRoot";
import ImpulsePostDetails from "../pages/impulse/ImpulsePostDetails";
import ImpulseRoot from "../pages/impulse/ImpulseRoot";
import MyActivity from "../pages/impulse/MyActivity";
import { MyActivityTypes } from "../types/impulse/feed.types";
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
    }),
    stringify: (params: { postId: string }) => ({
      postId: params.postId,
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
