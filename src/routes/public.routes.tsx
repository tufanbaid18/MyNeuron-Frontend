import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import PublicLayout from "../layouts/PublicLayout";
import { ROUTER_ROUTES } from "./routes";

import ConsultancyInfo from "../components/constant/CosultancyInfo";
import EventsInfo from "../components/constant/EventsInfo";
import PrivacyPolicy from "../components/constant/PrivacyPolicy";
import ProductInfo from "../components/constant/ProductInfo";
import TermsConditions from "../components/constant/TermConditions";

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
