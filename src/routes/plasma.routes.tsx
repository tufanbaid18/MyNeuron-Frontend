import { createRoute } from "@tanstack/react-router";
import { appRoute } from "./app.routes";
import { ROUTER_ROUTES } from "./routes";
import PlasmaRoot from "../pages/plasma/PlasmaRoot";
import Plasma from "../pages/plasma/Plasma";

export const plasmaRootRoute = createRoute({
  getParentRoute: () => appRoute,
  path: ROUTER_ROUTES.PLASMA,
  component: () => <PlasmaRoot />,
});

export const plasmaIndexRoute = createRoute({
  getParentRoute: () => plasmaRootRoute,
  path: "/",
  component: () => <Plasma />,
});
