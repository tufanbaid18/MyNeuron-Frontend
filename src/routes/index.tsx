import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import PublicLayout from "../layouts/PublicLayout";
import RootLayout from "../layouts/RootLayout";
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
  termsAndConditionsRoute,
} from "./info.routes";
import { ROUTER_ROUTES } from "./routes";
import { getUserProfile } from "../services/auth/auth.service";
import { appStore, userProfileAtom } from "../store/auth.store";

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTER_ROUTES.HOME,
  beforeLoad: async () => {
    const existingProfile = appStore.get(userProfileAtom);
    if (existingProfile) return;

    try {
      const profile = await getUserProfile();
      appStore.set(userProfileAtom, profile);
    } catch {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: () => <RootLayout />,
});

export const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTER_ROUTES.PUBLIC,
  beforeLoad: async () => {},
  component: () => <PublicLayout />,
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
