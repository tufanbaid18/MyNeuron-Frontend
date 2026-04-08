import { AppEnv, type ValidationSchema } from "../types/root.types";

export const envSchema: ValidationSchema = {
  VITE_API_BASE_URL: { type: "string", required: true },
  VITE_APP_ENV: { type: "enum", default: AppEnv.DEVELOPMENT, enumObj: AppEnv },
  VITE_DEFAULT_GATC_EVENT_ID: { type: "string", required: true },
  VITE_RAZORPAY_KEY_ID: { type: "string", required: true },
  VITE_APP_FRONTEND_URL: { type: "string", required: true },
  VITE_FIREBASE_API_KEY: { type: "string", required: true },
  VITE_FIREBASE_AUTH_DOMAIN: { type: "string", required: true },
  VITE_FIREBASE_DATABASE_URL: { type: "string", required: true },
  VITE_FIREBASE_PROJECT_ID: { type: "string", required: true },
  VITE_FIREBASE_STORAGE_BUCKET: { type: "string", required: true },
  VITE_FIREBASE_MESSAGING_SENDER_ID: { type: "string", required: true },
  VITE_FIREBASE_APP_ID: { type: "string", required: true },
};
