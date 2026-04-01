export enum AppEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

export type EnvConfig = {
  VITE_API_BASE_URL: string;
  VITE_APP_ENV: AppEnv;
  VITE_DEFAULT_GATC_EVENT_ID: string;
  VITE_RAZORPAY_KEY_ID: string;
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
