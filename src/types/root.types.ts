export enum AppEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  STAGING = "staging",
}

export type EnvConfig = {
  VITE_API_BASE_URL: string;
  VITE_APP_ENV: AppEnv;
  VITE_DEFAULT_GATC_EVENT_ID: string;
  VITE_RAZORPAY_KEY_ID: string;
  VITE_APP_FRONTEND_URL: string;
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_DATABASE_URL: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
};

// 2. Define how each variable should be validated
export type ValidationSchema = Record<
  keyof EnvConfig,
  {
    type: "string" | "number" | "boolean" | "enum";
    required?: boolean;
    default?: unknown;
    enumObj?: Record<string, unknown>;
  }
>;
