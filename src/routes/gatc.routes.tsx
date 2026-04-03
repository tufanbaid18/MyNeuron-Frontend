import { createRoute } from "@tanstack/react-router";

import GatcIndex from "../pages/GATC/GatcIndex";
import GatcMyHandshakes from "../pages/GATC/GatcMyHandshakes";
import GatcParticipants from "../pages/GATC/GatcParticipants";
import GatcPrograms from "../pages/GATC/GatcPrograms";
import GatcRoot from "../pages/GATC/GatcRoot";
import GatcSpeakers from "../pages/GATC/GatcSpeakers";
import GatcRegistration from "../pages/GATC/Registration";
import { appRoute } from "./app.routes";
import { ROUTER_ROUTES } from "./routes";

export const gatcRootRoute = createRoute({
  getParentRoute: () => appRoute,
  path: ROUTER_ROUTES.GATC,
  component: () => <GatcRoot />,
});

export const gatcIndexRoute = createRoute({
  getParentRoute: () => gatcRootRoute,
  path: "/",
  component: () => <GatcIndex />,
});

export const gatcProgramsRoute = createRoute({
  getParentRoute: () => gatcRootRoute,
  path: ROUTER_ROUTES.GATC_PROGRAMS,
  component: () => <GatcPrograms />,
});

export const gatcSpeakersRoute = createRoute({
  getParentRoute: () => gatcRootRoute,
  path: ROUTER_ROUTES.GATC_SPEAKERS,
  component: () => <GatcSpeakers />,
});

export const gatcParticipantsRoute = createRoute({
  getParentRoute: () => gatcRootRoute,
  path: ROUTER_ROUTES.GATC_PARTICIPANTS,
  component: () => <GatcParticipants />,
});

export const gatcMyHandshakesRoute = createRoute({
  getParentRoute: () => gatcRootRoute,
  path: ROUTER_ROUTES.GATC_MY_HANDSHAKES,
  component: () => <GatcMyHandshakes />,
});

export const gatcRegistrationRoute = createRoute({
  getParentRoute: () => gatcRootRoute,
  path: ROUTER_ROUTES.GATC_REGISTRATION,
  component: () => <GatcRegistration />,
});
