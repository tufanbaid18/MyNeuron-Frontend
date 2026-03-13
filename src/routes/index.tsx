import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { appRoute } from "./app.routes";
import {
  authRoute,
  loginRoute,
  registerRoute,
  verifyEmailRoute,
} from "./auth.routes";

import {
  consultancyInfoRoute,
  eventsInfoRoute,
  privacyPolicyRoute,
  productsInfoRoute,
  publicRoute,
  termsAndConditionsRoute,
} from "./public.routes";

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

export const routeTree = rootRoute.addChildren([
  authRoute.addChildren([loginRoute, registerRoute, verifyEmailRoute]),
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
