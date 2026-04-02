import { createRoute } from "@tanstack/react-router";
import ImpulseFeed from "../pages/impulse/ImpulseFeed";
import ImpulseRoot from "../pages/impulse/ImpulseRoot";
import { appRoute } from "./app.routes";
import { ROUTER_ROUTES } from "./routes";

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
