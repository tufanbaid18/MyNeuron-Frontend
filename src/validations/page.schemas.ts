import { z } from "zod";

import { PageCategory } from "../types/impulse/page.types";

// ════════════════════════════════════════════════════════════════
// Page Creation — Zod Validation Schemas
// ════════════════════════════════════════════════════════════════

export const PAGE_IMAGE_CONSTANTS = {
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_SIZE_MB: 5,
  ALLOWED_LABEL: "JPEG, PNG, or WebP",
} as const;

// ── Shared / Common fields ──────────────────────────────────────

const imageField = z
  .instanceof(File)
  .refine(
    (f) => PAGE_IMAGE_CONSTANTS.ALLOWED_TYPES.some((t) => t === f.type),
    `Only ${PAGE_IMAGE_CONSTANTS.ALLOWED_LABEL} images are allowed`,
  )
  .refine(
    (f) => f.size <= PAGE_IMAGE_CONSTANTS.MAX_SIZE_MB * 1024 * 1024,
    `Image must be under ${PAGE_IMAGE_CONSTANTS.MAX_SIZE_MB}MB`,
  )
  .optional();

const commonFields = {
  page_name: z
    .string()
    .min(1, "Page name is required")
    .max(100, "Page name must be under 100 characters")
    .trim(),

  category: z.nativeEnum(PageCategory, {
    error: "Category is required",
  }),

  bio: z
    .string()
    .min(1, "Bio is required")
    .max(500, "Bio must be under 500 characters")
    .trim(),

  cover_image: imageField,
  profile_image: imageField,

  website: z
    .string()
    .url("Enter a valid URL")
    .max(200, "Website URL is too long")
    .or(z.literal(""))
    .optional(),

  state: z
    .string()
    .max(100, "State must be under 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  zip: z
    .string()
    .max(10, "ZIP code must be under 10 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .max(100, "Country must be under 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
};

// ── Company fields ──────────────────────────────────────────────

const companyFields = {
  company_name: z
    .string()
    .max(150, "Company name must be under 150 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  official_website: z
    .string()
    .url("Enter a valid URL")
    .max(200, "Official website URL is too long")
    .or(z.literal(""))
    .optional(),

  company_bio: z
    .string()
    .max(500, "Company bio must be under 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  cin: z
    .string()
    .max(30, "CIN must be under 30 characters")
    .trim()
    .optional()
    .or(z.literal("")),
};

// ── Event fields ────────────────────────────────────────────────

const eventFields = {
  event_name: z
    .string()
    .max(150, "Event name must be under 150 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  event_description: z
    .string()
    .max(1000, "Event description must be under 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  tags: z
    .array(z.string().min(1, "Tag cannot be empty").max(50, "Tag is too long"))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
};

// ── Community fields ────────────────────────────────────────────

const communityFields = {
  community_details: z
    .string()
    .max(1000, "Community details must be under 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
};

// ── Combined schema ─────────────────────────────────────────────

export const createPageSchema = z.object({
  ...commonFields,
  ...companyFields,
  ...eventFields,
  ...communityFields,
});

export type CreatePageFormValues = z.infer<typeof createPageSchema>;

// ── Default values ──────────────────────────────────────────────

export const createPageDefaultValues: Omit<
  CreatePageFormValues,
  "cover_image" | "profile_image"
> = {
  page_name: "",
  category: PageCategory.GENERAL,
  bio: "",
  website: "",
  state: "",
  zip: "",
  country: "",

  // Company
  company_name: "",
  official_website: "",
  company_bio: "",
  cin: "",

  // Event
  event_name: "",
  event_description: "",
  tags: [],

  // Community
  community_details: "",
};
