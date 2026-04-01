import { createRoute } from "@tanstack/react-router";
import BookShelfRoot from "../pages/bookshelf/BookShelfRoot";
import MyBookshelf from "../pages/bookshelf/MyBookshelf";
import { appRoute } from "./app.routes";
import { ROUTER_ROUTES } from "./routes";

export const bookshelfRootRoute = createRoute({
  getParentRoute: () => appRoute,
  path: ROUTER_ROUTES.MY_BOOKSHELF,
  component: () => <BookShelfRoot />,
});

export const bookshelfIndexRoute = createRoute({
  getParentRoute: () => bookshelfRootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>): { folderId?: number } => {
    return {
      folderId: search.folderId ? Number(search.folderId) : undefined,
    };
  },
  component: () => <MyBookshelf />,
});
