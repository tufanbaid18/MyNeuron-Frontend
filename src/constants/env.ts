import { validateEnv } from "../config/env.config";
import { AppEnv, type ValidationSchema } from "../types/root.types";

export const envSchema: ValidationSchema = {
  VITE_API_BASE_URL: { type: "string", required: true },
  VITE_APP_ENV: { type: "enum", default: AppEnv.DEVELOPMENT, enumObj: AppEnv },
};
export const env = validateEnv();
