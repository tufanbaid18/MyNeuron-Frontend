import { createRoute } from "@tanstack/react-router";
import GatcIndex from "../pages/GatcIndex";
import GatcMyHandshakes from "../pages/GatcMyHandshakes";
import GatcParticipants from "../pages/GatcParticipants";
import GatcPrograms from "../pages/GatcPrograms";
import GatcRoot from "../pages/GatcRoot";
import GatcSpeakers from "../pages/GatcSpeakers";
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
