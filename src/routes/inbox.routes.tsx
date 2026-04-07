import { createRoute } from "@tanstack/react-router";
import Inbox from "../pages/inbox/Inbox";
import { appRoute } from "./app.routes";
import { ROUTER_ROUTES } from "./routes";

export const inboxRootRoute = createRoute({
  getParentRoute: () => appRoute,
  path: ROUTER_ROUTES.INBOX,
  component: () => <Inbox />,
});

export const inboxUserRoute = createRoute({
  getParentRoute: () => inboxRootRoute,
  path: "$userId",
  component: () => <Inbox />,
});
