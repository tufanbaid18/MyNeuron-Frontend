// ════════════════════════════════════════════════════════════════
// GATC Payment Flow — Types & Enums
// ════════════════════════════════════════════════════════════════

// ── Enums ────────────────────────────────────────────────────

export enum PaymentFlowStatus {
  IDLE = "IDLE",
  REGISTERING = "REGISTERING",
  ORDER_CREATING = "ORDER_CREATING",
  RAZORPAY_OPEN = "RAZORPAY_OPEN",
  VERIFYING = "VERIFYING",
  MANUAL_PAYMENT = "MANUAL_PAYMENT",
  MANUAL_SUBMITTED = "MANUAL_SUBMITTED",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export enum RegistrationStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ManualPaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ── API Response Types ───────────────────────────────────────

export type EventPricing = {
  id: number;
  category: string;
  price: string; // "7000.00" — string from backend
};

export type GatcEvent = {
  id: number;
  name: string;
  pricing: EventPricing[];
};

export type GatcRegistrationResponse = {
  message: string;
  data: GatcRegistration;
};

export type GatcRegistration = {
  id: number;
  name: string;
  email: string;
  amount: number;
  status: RegistrationStatus;
  created_at: string;
  event: number;
  pricing: number;
};

export type CreateOrderResponse = {
  order_id: string;
  amount: number;
  event: string;
  category: string;
};

export type CreateOrderErrorResponse = {
  error: string;
};

export type ManualPaymentResponse = {
  id: number;
  transaction_id: string;
  screenshot: string;
  status: ManualPaymentStatus;
  created_at: string;
  registration: number;
};

// ── Request Payloads ─────────────────────────────────────────

export type GatcRegistrationPayload = {
  event: number;
  pricing: number;
};

export type VerifyPaymentPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

// ── Razorpay SDK Types ───────────────────────────────────────

export type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayOptions = {
  key: string;
  amount: number; // in paise (rupees × 100)
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill: { name: string; email: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
};

// ── Component State ──────────────────────────────────────────

export type PaymentFlowState = {
  status: PaymentFlowStatus;
  registrationId: number | null;
  errorMessage: string | null;
};
