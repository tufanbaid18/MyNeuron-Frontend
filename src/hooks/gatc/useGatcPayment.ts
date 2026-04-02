import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { env } from "../../constants/env";
import { GATC_CONSTANTS } from "../../constants/gatc.constants";
import {
  createOrder,
  createRegistration,
  getEvents,
  submitManualPayment,
  verifyPayment,
  verifyVirtualPass,
} from "../../services/gatc/gatc.service";
import type {
  GatcEvent,
  GatcRegistrationPayload,
  VerifyPaymentPayload,
} from "../../types/gatc/gatc.types";

// ════════════════════════════════════════════════════════════════
// GATC Payment — React-Query Hooks
// ════════════════════════════════════════════════════════════════

/** Fetches all events and selects the default event by env ID */
export const useDefaultEvent = () => {
  return useQuery({
    queryKey: ["gatc-events"],
    queryFn: getEvents,
    staleTime: GATC_CONSTANTS.EVENTS_STALE_TIME,
    select: (events: GatcEvent[]) => {
      const defaultId = Number(env.VITE_DEFAULT_GATC_EVENT_ID);
      return events.find((e) => e.id === defaultId) ?? null;
    },
  });
};

/** Creates a registration entry (POST /registrations/) */
export const useGatcRegistration = () => {
  return useMutation({
    mutationFn: (data: GatcRegistrationPayload) => createRegistration(data),
    onError: (error) => {
      toast.error(
        `Registration failed: ${error.message || "Please try again."}`,
      );
    },
  });
};

/**
 * Creates a Razorpay order (POST /create-order/{id}/).
 * Error handling is done manually in PaymentStep to detect
 * 400 "Maximum payment attempts reached" separately.
 */
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (registrationId: number) => createOrder(registrationId),
  });
};

/** Verifies Razorpay payment signature (POST /verify-payment/) */
export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (data: VerifyPaymentPayload) => verifyPayment(data),
    onError: (error) => {
      toast.error(
        `Payment verification failed: ${error.message || "Contact support."}`,
      );
    },
  });
};

/** Submits manual payment (POST /manual-payment/ — multipart) */
export const useManualPayment = () => {
  return useMutation({
    mutationFn: (formData: FormData) => submitManualPayment(formData),
    onError: (error) => {
      toast.error(
        `Manual payment failed: ${error.message || "Please try again."}`,
      );
    },
  });
};

export const useVerifyVirtualPass = () => {
  return useMutation({
    mutationFn: ({ userId, eventId }: { userId: number; eventId: number }) =>
      verifyVirtualPass({ userId, eventId }),
    onError: (error) => {
      toast.error(
        `Virtual pass verification failed: ${error.message || "Contact support."}`,
      );
    },
  });
};
