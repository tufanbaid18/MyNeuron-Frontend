import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from ".";
import { APP_ROUTES } from "../constants/app.routes";
import RootLayout from "../layouts/RootLayout";
import { getUserProfile } from "../services/auth/auth.service";
import { appStore, userProfileAtom } from "../store/auth.store";

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
