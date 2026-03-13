import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import PublicLayout from "../layouts/PublicLayout";
import RootLayout from "../layouts/RootLayout";
import {
  authRoute,
  loginRoute,
  registerRoute,
  verifyEmailRoute
} from "./auth.routes";
import {
  consultancyInfoRoute,
  eventsInfoRoute,
  privacyPolicyRoute,
  productsInfoRoute,
  termsAndConditionsRoute,
} from "./info.routes";
import { ROUTER_ROUTES } from "./routes";

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
  authRoute.addChildren([
    loginRoute,
    registerRoute,
    verifyEmailRoute,
  ]),
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
