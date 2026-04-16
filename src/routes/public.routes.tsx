import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from ".";
import PublicLayout from "../layouts/PublicLayout";
import { ROUTER_ROUTES } from "./routes";

import ConsultancyInfo from "../components/public/CosultancyInfo";
import EventsInfo from "../components/public/EventsInfo";
import PrivacyPolicy from "../components/public/PrivacyPolicy";
import ProductInfo from "../components/public/ProductInfo";
import PublicUserInfo from "../components/public/PublicUserInfo";
import TermsConditions from "../components/public/TermConditions";
import VirtualPassVerification from "../pages/GATC/VirtualPassVerification";

export const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTER_ROUTES.PUBLIC,
  beforeLoad: async () => {},
  component: () => <PublicLayout />,
});

export const eventsInfoRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: ROUTER_ROUTES.EVENTS_INFO,
  component: () => <EventsInfo />,
});

export const consultancyInfoRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: ROUTER_ROUTES.CONSULTANCY_INFO,
  component: () => <ConsultancyInfo />,
});

export const productsInfoRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: ROUTER_ROUTES.PRODUCTS_INFO,
  component: () => <ProductInfo />,
});

export const termsAndConditionsRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: ROUTER_ROUTES.TERMS_AND_CONDITIONS,
  component: () => <TermsConditions />,
});

export const privacyPolicyRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: ROUTER_ROUTES.PRIVACY_POLICY,
  component: () => <PrivacyPolicy />,
});

export const gatcVirtualPassRoute = createRoute({
  getParentRoute: () => publicRoute,
  validateSearch: z.object({
    user_id: z.string().or(z.number()).optional(),
    event_id: z.string().or(z.number()).optional(),
  }),
  path: ROUTER_ROUTES.GATC_VIRTUAL_PASS,
  component: () => <VirtualPassVerification />,
});

export const publicUserRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: ROUTER_ROUTES.PUBLIC_USER,
  component: () => <PublicUserInfo />,
});
