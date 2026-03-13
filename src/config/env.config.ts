import { envSchema } from "../constants/env";
import { type EnvConfig } from "../types/root.types";

// 1. Declare your environment variables and their types here

export const validateEnv = (): EnvConfig => {
  const parsedEnv: Partial<EnvConfig> = {};

  for (const [key, config] of Object.entries(envSchema)) {
    const { type, required, default: defaultValue, enumObj } = config as any;
    const value = import.meta.env[key];

    // Check if required but missing
    if (required && (value === undefined || value === null || value === "")) {
      throw new Error(`Environment variable missing or empty: ${key}`);
    }

    // Assign value or fallback to default
    let finalValue = value !== undefined && value !== "" ? value : defaultValue;

    if (finalValue !== undefined) {
      if (type === "number") {
        finalValue = Number(finalValue);
        if (isNaN(finalValue))
          throw new Error(`Environment variable ${key} must be a number`);
      } else if (type === "boolean") {
        finalValue = String(finalValue).toLowerCase() === "true";
      } else if (type === "enum" && enumObj) {
        if (!Object.values(enumObj).includes(finalValue)) {
          throw new Error(
            `Invalid ${key} value: ${finalValue}. Expected one of: ${Object.values(enumObj).join(", ")}`,
          );
        }
      }
    }

    parsedEnv[key as keyof EnvConfig] = finalValue;
  }

  return parsedEnv as EnvConfig;
};
