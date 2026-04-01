// ════════════════════════════════════════════════════════════════
// GATC Payment — Centralized Constants
// Change values here to update across the entire payment flow.
// ════════════════════════════════════════════════════════════════

export const GATC_CONSTANTS = {
  /** Maximum Razorpay payment attempts before switching to manual */
  MAX_PAYMENT_ATTEMPTS: 3,

  /** Currency for Razorpay checkout */
  CURRENCY: "INR",

  /** Merchant display name in Razorpay popup */
  MERCHANT_NAME: "MyNeuron - GATC 2026",

  /** Razorpay checkout description */
  PAYMENT_DESCRIPTION: "GATC 2026 Registration",

  /** Razorpay theme color (matches AntD primary) */
  RAZORPAY_THEME_COLOR: "#7c3aed",

  /** Max screenshot file size for manual payment (5MB) */
  MAX_SCREENSHOT_SIZE_MB: 5,

  /** Allowed screenshot MIME types */
  ALLOWED_SCREENSHOT_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ] as readonly string[],

  /** Support email for payment issues */
  SUPPORT_EMAIL: "info@bencoslife.com",

  /** Path to UPI QR code image (relative to public/) */
  UPI_QR_IMAGE_PATH: "/upi_qr.png",

  /** React-Query stale time for events (10 min — events rarely change) */
  EVENTS_STALE_TIME: 10 * 60 * 1000,
} as const;

/** Error message the backend returns when max payment attempts are exhausted */
export const MAX_ATTEMPTS_ERROR = "Maximum payment attempts reached";
