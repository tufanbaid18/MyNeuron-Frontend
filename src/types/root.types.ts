export enum AppEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

export type EnvConfig = {
  VITE_API_BASE_URL: string;
  VITE_APP_ENV: AppEnv;
};

// 2. Define how each variable should be validated
export type ValidationSchema = Record<
  keyof EnvConfig,
  {
    type: "string" | "number" | "boolean" | "enum";
    required?: boolean;
    default?: any;
    enumObj?: any;
  }
>;
