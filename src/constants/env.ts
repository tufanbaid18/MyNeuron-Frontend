import { validateEnv } from "../config/env.config";
import { envSchema } from "../config/env.schema";

// Pass `false` so it logs a warning instead of throwing an unhandled exception in the browser console.
// Also use a safe fallback because this file gets evaluated by Node.js when `vite.config.ts` runs.
export const env = validateEnv(
  typeof import.meta !== "undefined" && (import.meta as unknown as { env: Record<string, string> }).env
    ? (import.meta as unknown as { env: Record<string, string> }).env
    : {},
  envSchema,
  false,
);
