import { z } from "zod";

export const createZodValidator = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  fieldName: keyof T,
  mode: "profile" | "registration" = "profile"
) => {
  return async (_: unknown, value: unknown) => {
    const fieldSchema = schema.shape[fieldName] as unknown as z.ZodTypeAny;
    if (!fieldSchema) return Promise.resolve();
    
    // Ant Design sometimes passes undefined for untouched empty fields
    const valueToValidate = value === undefined ? "" : value;

    // Optional override: In profile mode, empty fields are valid (they can be filled later or ignored)
    if (mode === "profile" && (valueToValidate === "" || (Array.isArray(valueToValidate) && valueToValidate.length === 0) || valueToValidate === null)) {
      return Promise.resolve();
    }

    const result = fieldSchema.safeParse(valueToValidate);
    if (!result.success) {
      const zodError = result.error as z.ZodError;
      return Promise.reject(new Error(zodError.issues[0].message));
    }
    return Promise.resolve();
  };
};
