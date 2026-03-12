import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import { ROUTER_ROUTES } from "./routes";
import AuthLayout from "../layouts/AuthLayout";
import LogIn from "../pages/LogIn";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTER_ROUTES.AUTH,
  component: () => <AuthLayout />,
});

export const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: ROUTER_ROUTES.LOGIN,
  beforeLoad: async () => {},
  component: () => <LogIn />,
});
