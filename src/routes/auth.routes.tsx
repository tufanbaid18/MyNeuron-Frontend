import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from ".";
import AuthLayout from "../layouts/AuthLayout";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
import VerificationMail from "../pages/VerificationMail";
import { ROUTER_ROUTES } from "./routes";
import { getUserProfile } from "../services/auth/auth.service";
import { appStore, userProfileAtom } from "../store/auth.store";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTER_ROUTES.AUTH,
  beforeLoad: async () => {
    let isAuthenticated = false;
    try {
      const profile = await getUserProfile();
      appStore.set(userProfileAtom, profile);
      isAuthenticated = true;
    } catch (error) {
      // Unauthenticated, let them proceed
    }

    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: () => <AuthLayout />,
});

export const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: ROUTER_ROUTES.LOGIN,
  component: () => <LogIn />,
});

export const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: ROUTER_ROUTES.REGISTER,
  component: () => <Register />,
});

export const verifyEmailRoute = createRoute({
  getParentRoute: () => authRoute,
  path: ROUTER_ROUTES.VERIFY_EMAIL,
  component: () => <VerificationMail />,
});
