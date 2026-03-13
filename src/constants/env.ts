import { validateEnv } from "../config/env.config";
import { AppEnv, type ValidationSchema } from "../types/root.types";

export const envSchema: ValidationSchema = {
  VITE_API_BASE_URL: { type: "string", required: true },
  VITE_APP_ENV: { type: "enum", default: AppEnv.DEVELOPMENT, enumObj: AppEnv },
};

// We pass `false` so it logs a warning instead of throwing an unhandled exception in the browser console.
// We also use a safe fallback because this file gets evaluated by Node.js when `vite.config.ts` runs.
export const env = validateEnv(typeof import.meta !== "undefined" && (import.meta as any).env ? (import.meta as any).env : {}, envSchema, false);

