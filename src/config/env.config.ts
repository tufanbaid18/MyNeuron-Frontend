import { type EnvConfig, type ValidationSchema } from "../types/root.types";

// 1. Declare your environment variables and their types here


export const validateEnv = (
  envObject: Record<string, any>,
  schema: ValidationSchema,
  throwOnError: boolean = true
): EnvConfig => {
  const parsedEnv: Partial<EnvConfig> = {};

  for (const [key, config] of Object.entries(schema)) {
    const { type, required, default: defaultValue, enumObj } = config as any;
    const value = envObject[key];

    // Check if required but missing
    if (required && (value === undefined || value === null || value === "")) {
      if (throwOnError) {
        throw new Error(`Environment variable missing or empty: ${key}`);
      } else {
        console.warn(`[Env Warning] Missing or empty: ${key}`);
      }
    }

    // Assign value or fallback to default
    let finalValue = value !== undefined && value !== "" ? value : defaultValue;

    if (finalValue !== undefined) {
      if (type === "number") {
        finalValue = Number(finalValue);
        if (isNaN(finalValue) && throwOnError) {
          throw new Error(`Environment variable ${key} must be a number`);
        }
      } else if (type === "boolean") {
        finalValue = String(finalValue).toLowerCase() === "true";
      } else if (type === "enum" && enumObj) {
        if (!Object.values(enumObj).includes(finalValue)) {
          if (throwOnError) {
            throw new Error(
              `Invalid ${key} value: ${finalValue}. Expected one of: ${Object.values(enumObj).join(", ")}`,
            );
          } else {
            console.warn(`[Env Warning] Invalid ${key} value: ${finalValue}`);
          }
        }
      }
    }

    parsedEnv[key as keyof EnvConfig] = finalValue as any;
  }

  return parsedEnv as EnvConfig;
};

