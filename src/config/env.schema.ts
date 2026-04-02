import { AppEnv, type ValidationSchema } from "../types/root.types";

export const envSchema: ValidationSchema = {
  VITE_API_BASE_URL: { type: "string", required: true },
  VITE_APP_ENV: { type: "enum", default: AppEnv.DEVELOPMENT, enumObj: AppEnv },
  VITE_DEFAULT_GATC_EVENT_ID: { type: "string", required: true },
  VITE_RAZORPAY_KEY_ID: { type: "string", required: true },
  VITE_APP_FRONTEND_URL: { type: "string", required: true },
};
