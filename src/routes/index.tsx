import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import RootLayout from "../layouts/RootLayout";
import { ROUTER_ROUTES } from "./routes";
import { authRoute, loginRoute, registerRoute } from "./auth.routes";

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTER_ROUTES.HOME,
  beforeLoad: async () => {},
  component: () => <RootLayout />,
});

export const routeTree = rootRoute.addChildren([
  authRoute.addChildren([loginRoute, registerRoute]),
  appRoute.addChildren([]),
]);

export const router = createRouter({ routeTree });
