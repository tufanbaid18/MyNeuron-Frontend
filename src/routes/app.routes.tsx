import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from ".";
import { ROUTER_ROUTES } from "./routes";
import { appStore, userProfileAtom } from "../store/auth.store";
import { getUserProfile } from "../services/auth/auth.service";
import RootLayout from "../layouts/RootLayout";
import { APP_ROUTES } from "../constants/app.routes";

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
      throw redirect({ to: APP_ROUTES.LOGIN });
    }
  },
  component: () => <RootLayout />,
});
