import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { appRoute } from "./app.routes";
import {
  authRoute,
  forgotPasswordRoute,
  loginRoute,
  registerRoute,
  resendVerificationEmailRoute,
  resetPasswordRoute,
  verifyEmailRoute,
} from "./auth.routes";

import { APP_ROUTES } from "../constants/app.routes";
import NotFound from "../pages/error/NotFound";
import { bookshelfIndexRoute, bookshelfRootRoute } from "./bookshelf.routes";
import {
  gatcIndexRoute,
  gatcMemberDetailsRoute,
  gatcMyHandshakesRoute,
  gatcParticipantsRoute,
  gatcProgramsRoute,
  gatcRegistrationRoute,
  gatcRootRoute,
  gatcSpeakersRoute,
} from "./gatc.routes";
import {
  impulseActivityRoute,
  impulseFeedRootRoute,
  impulseFeedRoute,
  impulsePostDetailsRoute,
  impulseRootRoute,
} from "./impulse.routes";
import { inboxRootRoute, inboxUserRoute } from "./inbox.routes";
import { plasmaIndexRoute, plasmaRootRoute } from "./plasma.routes";
import {
  consultancyInfoRoute,
  eventsInfoRoute,
  gatcVirtualPassRoute,
  privacyPolicyRoute,
  productsInfoRoute,
  publicRoute,
  termsAndConditionsRoute,
} from "./public.routes";
import { userIndexRoute, userProfileRoute, userRootRoute } from "./user.routes";

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
  authRoute.addChildren([
    loginRoute,
    registerRoute,
    resendVerificationEmailRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
    verifyEmailRoute,
  ]),
  appRoute.addChildren([
    indexAppRoute,
    plasmaRootRoute.addChildren([plasmaIndexRoute]),
    gatcRootRoute.addChildren([
      gatcRegistrationRoute,
      gatcIndexRoute,
      gatcSpeakersRoute,
      gatcMemberDetailsRoute,
      gatcProgramsRoute,
      gatcParticipantsRoute,
      gatcMyHandshakesRoute,
    ]),
    userRootRoute.addChildren([userIndexRoute, userProfileRoute]),
    bookshelfRootRoute.addChildren([bookshelfIndexRoute]),
    impulseRootRoute.addChildren([
      impulseFeedRootRoute.addChildren([
        impulseFeedRoute,
        impulsePostDetailsRoute,
      ]),
      impulseActivityRoute,
    ]),
    inboxRootRoute.addChildren([inboxUserRoute]),
  ]),
  publicRoute.addChildren([
    eventsInfoRoute,
    productsInfoRoute,
    consultancyInfoRoute,
    termsAndConditionsRoute,
    privacyPolicyRoute,
    gatcVirtualPassRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <NotFound />,
});
