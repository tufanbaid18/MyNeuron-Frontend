import { createRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { rootRoute } from ".";
import { APP_ROUTES } from "../constants/app.routes";
import AuthLayout from "../layouts/AuthLayout";
import ForgetPassword from "../pages/auth/ForgotPassword";
import LogIn from "../pages/auth/LogIn";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import VerificationMail from "../pages/auth/VerificationMail";
import VerifyEmail from "../pages/auth/VerifyEmail";
import { getUserProfile } from "../services/auth/auth.service";
import { appStore, userProfileAtom } from "../store/auth.store";
import { ROUTER_ROUTES } from "./routes";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTER_ROUTES.AUTH,
  beforeLoad: async () => {
    let isAuthenticated = false;
    try {
      const profile = await getUserProfile();
      appStore.set(userProfileAtom, profile);
      isAuthenticated = true;
    } catch (error) {}

    if (isAuthenticated) {
      throw redirect({ to: APP_ROUTES.ROOT });
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

export const resendVerificationEmailRoute = createRoute({
  getParentRoute: () => authRoute,
  path: ROUTER_ROUTES.RESEND_EMAIL,
  component: () => <VerificationMail />,
});
export const forgotPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: ROUTER_ROUTES.FORGOT_PASSWORD,
  component: () => <ForgetPassword />,
});
export const resetPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: ROUTER_ROUTES.RESET_PASSWORD,
  component: () => <ResetPassword />,
});

export const verifyEmailRoute = createRoute({
  getParentRoute: () => authRoute,
  path: ROUTER_ROUTES.VERIFY_EMAIL,
  validateSearch: z.object({
    token: z.string(),
  }),
  component: () => <VerifyEmail />,
});
