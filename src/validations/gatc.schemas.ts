import { z } from "zod";

import { GATC_CONSTANTS } from "../constants/gatc.constants";

// ════════════════════════════════════════════════════════════════
// GATC — Zod Validation Schemas
// ════════════════════════════════════════════════════════════════

export const manualPaymentSchema = z.object({
  transaction_id: z
    .string()
    .min(1, "Transaction ID is required")
    .max(50, "Transaction ID is too long")
    .trim(),
  screenshot: z
    .instanceof(File)
    .refine(
      (f) => GATC_CONSTANTS.ALLOWED_SCREENSHOT_TYPES.includes(f.type),
      "Only JPEG, PNG, and WebP images are allowed",
    )
    .refine(
      (f) =>
        f.size <= GATC_CONSTANTS.MAX_SCREENSHOT_SIZE_MB * 1024 * 1024,
      `File size must be under ${GATC_CONSTANTS.MAX_SCREENSHOT_SIZE_MB}MB`,
    ),
});

export type ManualPaymentForm = z.infer<typeof manualPaymentSchema>;
