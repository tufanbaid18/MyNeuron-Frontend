import { createRoute } from "@tanstack/react-router";
import z from "zod";
import ImpulseFeed from "../pages/impulse/ImpulseFeed";
import ImpulseRoot from "../pages/impulse/ImpulseRoot";
import MyActivity from "../pages/impulse/MyActivity";
import { appRoute } from "./app.routes";
import { ROUTER_ROUTES } from "./routes";
import { MyActivityTypes } from "../types/impulse/feed.types";

export const impulseRootRoute = createRoute({
  getParentRoute: () => appRoute,
  path: ROUTER_ROUTES.IMPULSE,
  component: () => <ImpulseRoot />,
});

export const impulseFeedRoute = createRoute({
  getParentRoute: () => impulseRootRoute,
  path: ROUTER_ROUTES.IMPULSE_FEED,
  component: () => <ImpulseFeed />,
});

export const impulseActivityRoute = createRoute({
  getParentRoute: () => impulseRootRoute,
  path: ROUTER_ROUTES.ACTIVITY,
  validateSearch: z.object({
    filter: z.enum(MyActivityTypes),
  }),
  component: () => <MyActivity />,
});
