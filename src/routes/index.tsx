import {
  createRootRoute,
  createRouter,
  Outlet,
  createRoute,
  redirect,
} from "@tanstack/react-router";
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
import { APP_ROUTES } from "../constants/app.routes";
import NotFound from "../pages/error/NotFound";
import { plasmaIndexRoute, plasmaRootRoute } from "./plasma.routes";
import {
  gatcIndexRoute,
  gatcMyHandshakesRoute,
  gatcParticipantsRoute,
  gatcProgramsRoute,
  gatcRootRoute,
  gatcSpeakersRoute,
} from "./gatc.routes";

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Redirect from / to /plasma
export const indexAppRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: APP_ROUTES.PLASMA });
  },
});

export const routeTree = rootRoute.addChildren([
  authRoute.addChildren([loginRoute, registerRoute, verifyEmailRoute]),
  appRoute.addChildren([
    indexAppRoute,
    plasmaRootRoute.addChildren([plasmaIndexRoute]),
    gatcRootRoute.addChildren([
      gatcIndexRoute,
      gatcSpeakersRoute,
      gatcProgramsRoute,
      gatcParticipantsRoute,
      gatcMyHandshakesRoute,
    ]),
  ]),
  publicRoute.addChildren([
    eventsInfoRoute,
    productsInfoRoute,
    consultancyInfoRoute,
    termsAndConditionsRoute,
    privacyPolicyRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <NotFound />,
});
