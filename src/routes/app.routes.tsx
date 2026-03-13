import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from ".";
import { ROUTER_ROUTES } from "./routes";
import { appStore, userProfileAtom } from "../store/auth.store";
import { getUserProfile } from "../services/auth/auth.service";
import RootLayout from "../layouts/RootLayout";
import { APP_ROUTES } from "../constants/app.routes";
import Plasma from "../pages/Plasma";

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_app",
  beforeLoad: async () => {
    const existingProfile = appStore.get(userProfileAtom);
    if (existingProfile) return;

    try {
      const profile = await getUserProfile();
      appStore.set(userProfileAtom, profile);
    } catch {
      throw redirect({ to: APP_ROUTES.LOGIN });
    }
  },
  component: () => <RootLayout />,
});

export const plasmaRoute = createRoute({
  getParentRoute: () => appRoute,
  path: ROUTER_ROUTES.PLASMA,
  component: () => <Plasma />,
});
