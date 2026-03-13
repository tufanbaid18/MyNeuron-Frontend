import { atom, createStore } from "jotai";
import type { UserProfile } from "../types/user/user.types";

// Standalone store shared between TanStack Router's beforeLoad (non-React) and React components
export const appStore = createStore();

export const userProfileAtom = atom<UserProfile | null>(null);

// Derived read-only atom
export const isAuthenticatedAtom = atom((get) => get(userProfileAtom) !== null);
