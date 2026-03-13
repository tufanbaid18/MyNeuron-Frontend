import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import RootLayout from "../layouts/RootLayout";
import { ROUTER_ROUTES } from "./routes";
import { authRoute, loginRoute, registerRoute } from "./auth.routes";
import {
  consultancyInfoRoute,
  eventsInfoRoute,
  privacyPolicyRoute,
  productsInfoRoute,
  termsAndConditionsRoute,
} from "./info.routes";
import PublicLayout from "../layouts/PublicLayout";

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTER_ROUTES.HOME,
  beforeLoad: async () => {},
  component: () => <RootLayout />,
});

export const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTER_ROUTES.PUBLIC,
  beforeLoad: async () => {},
  component: () => <PublicLayout />,
});

export const routeTree = rootRoute.addChildren([
  authRoute.addChildren([loginRoute, registerRoute]),
  appRoute.addChildren([]),
  publicRoute.addChildren([
    eventsInfoRoute,
    productsInfoRoute,
    consultancyInfoRoute,
    termsAndConditionsRoute,
    privacyPolicyRoute,
  ]),
]);

export const router = createRouter({ routeTree });
