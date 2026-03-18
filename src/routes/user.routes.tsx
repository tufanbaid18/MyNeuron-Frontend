import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import UserIndex from "../pages/user/UserIndex";
import UserProfile from "../pages/user/UserProfile";
import UserRoot from "../pages/user/UserRoot";
import { appRoute } from "./app.routes";
import { ROUTER_ROUTES } from "./routes";

export const userRootRoute = createRoute({
  getParentRoute: () => appRoute,
  path: ROUTER_ROUTES.USER,
  component: () => <UserRoot />,
});

export const userIndexRoute = createRoute({
  getParentRoute: () => userRootRoute,
  path: "/",
  component: () => <UserIndex />,
});

export const userProfileRoute = createRoute({
  getParentRoute: () => userRootRoute,
  path: ROUTER_ROUTES.PROFILE,
  validateSearch: z.object({
    userId: z.string(),
  }),
  component: () => <UserProfile />,
});
