import { API_ROUTES } from "../../constants/api.routes";
import axiosInstance from "../../lib/axiosInstance";
import type {
  CreateOrderResponse,
  GatcEvent,
  GatcProgramsResponse,
  GatcRegistration,
  GatcRegistrationPayload,
  GatcRegistrationResponse,
  ManualPaymentResponse,
  VerifyPassResponse,
  VerifyPaymentPayload,
} from "../../types/gatc/gatc.types";

// ════════════════════════════════════════════════════════════════
// GATC Payment — Service Layer
// ════════════════════════════════════════════════════════════════

/** GET /events/ — returns all events with pricing arrays */
export const getEvents = async (): Promise<GatcEvent[]> => {
  const res = await axiosInstance.get<GatcEvent[]>(API_ROUTES.GET_EVENTS);
  return res.data;
};

/** POST /registrations/ — creates a registration entry for payment */
export const createRegistration = async (
  data: GatcRegistrationPayload,
): Promise<GatcRegistration> => {
  const res = await axiosInstance.post<GatcRegistrationResponse>(
    API_ROUTES.CREATE_REGISTRATION,
    data,
  );
  return res.data.data;
};

/** POST /create-order/{registrationId}/ — creates Razorpay order */
export const createOrder = async (
  registrationId: number,
): Promise<CreateOrderResponse> => {
  const res = await axiosInstance.post<CreateOrderResponse>(
    API_ROUTES.CREATE_ORDER(registrationId),
  );
  return res.data;
};

/** POST /verify-payment/ — verifies Razorpay signature server-side */
export const verifyPayment = async (
  data: VerifyPaymentPayload,
): Promise<void> => {
  await axiosInstance.post(API_ROUTES.VERIFY_PAYMENT, data);
};

/** POST /manual-payment/ — uploads screenshot + txn ID (multipart) */
export const submitManualPayment = async (
  formData: FormData,
): Promise<ManualPaymentResponse> => {
  const res = await axiosInstance.post<ManualPaymentResponse>(
    API_ROUTES.MANUAL_PAYMENT,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
};

export const verifyVirtualPass = async ({
  userId,
  eventId,
}: {
  userId: number;
  eventId: number;
}): Promise<VerifyPassResponse> => {
  const res = await axiosInstance.get<VerifyPassResponse>(
    API_ROUTES.GATC_PASS,
    {
      params: {
        user_id: userId,
        event_id: eventId,
      },
    },
  );
  return res.data;
};

export const getGatcPrograms = async (): Promise<GatcProgramsResponse> => {
  const res = await axiosInstance.get<GatcProgramsResponse>(
    API_ROUTES.GATC_PROGRAMS,
  );
  return res.data;
};
