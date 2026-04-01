import {
  CreditCardOutlined,
  LoadingOutlined,
  SafetyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert, Button, Spin, Tag, Typography, message } from "antd";
import type { GlobalToken } from "antd/es/theme/interface";
import { useCallback, useState } from "react";

import { env } from "../../../../constants/env";
import {
  GATC_CONSTANTS,
  MAX_ATTEMPTS_ERROR,
} from "../../../../constants/gatc.constants";
import {
  useCreateOrder,
  useGatcRegistration,
  useVerifyPayment,
} from "../../../../hooks/gatc/useGatcPayment";
import { loadRazorpayScript } from "../../../../lib/razorpay";
import {
  PaymentFlowStatus,
  type EventPricing,
  type PaymentFlowState,
  type RazorpayOptions,
  type RazorpaySuccessResponse,
} from "../../../../types/gatc/gatc.types";
import type { UserProfile } from "../../../../types/user/user.types";
import { ManualPaymentStep } from "./ManualPaymentStep";
import { PaymentSuccessResult } from "./PaymentSuccessResult";

const { Text, Title } = Typography;

// ════════════════════════════════════════════════════════════════
// PaymentStep — Full Razorpay Flow Orchestrator
//
// Flow: Register → Create Order → Razorpay Popup → Verify
//       (3 failures) → Manual Payment
// ════════════════════════════════════════════════════════════════

type PaymentStepProps = {
  token: GlobalToken;
  selectedPricing: EventPricing;
  registrationId: number | null;
  setRegistrationId: (id: number) => void;
  userData: UserProfile | undefined;
  onBack: () => void;
};

const INITIAL_STATE: PaymentFlowState = {
  status: PaymentFlowStatus.IDLE,
  registrationId: null,
  errorMessage: null,
};

export const PaymentStep = ({
  token,
  selectedPricing,
  registrationId,
  setRegistrationId,
  userData,
  onBack,
}: PaymentStepProps) => {
  const [flowState, setFlowState] = useState<PaymentFlowState>(INITIAL_STATE);

  const registration = useGatcRegistration();
  const createOrder = useCreateOrder();
  const verifyPaymentMutation = useVerifyPayment();

  const amount = parseFloat(selectedPricing.price);

  // ── Step 1: Create Registration (if not already created) ──
  const handleStartPayment = useCallback(async () => {
    setFlowState({
      status: PaymentFlowStatus.REGISTERING,
      registrationId: registrationId,
      errorMessage: null,
    });

    try {
      let regId = registrationId;

      // Only create registration if we don't have one already
      if (!regId) {
        const userName = [
          userData?.first_name,
          userData?.middle_name,
          userData?.last_name,
        ]
          .filter(Boolean)
          .join(" ");

        const regResult = await registration.mutateAsync({
          name: userName || "Participant",
          email: userData?.email || "",
          event: Number(env.VITE_DEFAULT_GATC_EVENT_ID),
          pricing: selectedPricing.id,
        });

        regId = regResult.id;
        setRegistrationId(regId);
      }

      // Move to order creation
      await handleCreateOrder(regId);
    } catch {
      setFlowState((prev) => ({
        ...prev,
        status: PaymentFlowStatus.ERROR,
        errorMessage: "Failed to create registration. Please try again.",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationId, userData, selectedPricing]);

  // ── Step 2: Create Order ──
  const handleCreateOrder = useCallback(
    async (regId: number) => {
      setFlowState((prev) => ({
        ...prev,
        status: PaymentFlowStatus.ORDER_CREATING,
        registrationId: regId,
        errorMessage: null,
      }));

      try {
        const orderResult = await createOrder.mutateAsync(regId);
        await openRazorpay(orderResult.order_id, regId);
      } catch (error: unknown) {
        // Check if backend returned "Maximum payment attempts reached"
        const errData = (
          error as { response?: { data?: { error?: string } } }
        )?.response?.data;

        if (errData?.error === MAX_ATTEMPTS_ERROR) {
          setFlowState({
            status: PaymentFlowStatus.MANUAL_PAYMENT,
            registrationId: regId,
            errorMessage: null,
          });
          return;
        }

        setFlowState({
          status: PaymentFlowStatus.ERROR,
          registrationId: regId,
          errorMessage: "Failed to create payment order. Please try again.",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Step 3: Open Razorpay Popup ──
  const openRazorpay = useCallback(
    async (orderId: string, regId: number) => {
      setFlowState((prev) => ({
        ...prev,
        status: PaymentFlowStatus.RAZORPAY_OPEN,
      }));

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        message.error(
          "Failed to load payment gateway. Please check your internet connection.",
        );
        setFlowState({
          status: PaymentFlowStatus.ERROR,
          registrationId: regId,
          errorMessage:
            "Payment gateway failed to load. Please try again or use manual payment.",
        });
        return;
      }

      const options: RazorpayOptions = {
        key: env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100, // Convert rupees → paise
        currency: GATC_CONSTANTS.CURRENCY,
        name: GATC_CONSTANTS.MERCHANT_NAME,
        description: GATC_CONSTANTS.PAYMENT_DESCRIPTION,
        order_id: orderId,
        handler: (response: RazorpaySuccessResponse) => {
          handleVerifyPayment(response, regId);
        },
        prefill: {
          name: [userData?.first_name, userData?.last_name]
            .filter(Boolean)
            .join(" "),
          email: userData?.email || "",
        },
        theme: { color: GATC_CONSTANTS.RAZORPAY_THEME_COLOR },
        modal: {
          ondismiss: () => {
            // User closed the popup — retry by creating a new order
            // Backend tracks attempt count and will return 400 after 3
            handleCreateOrder(regId);
          },
        },
      };

      const RazorpayConstructor = (
        window as unknown as Record<string, unknown>
      ).Razorpay as new (opts: RazorpayOptions) => { open: () => void };
      const rzp = new RazorpayConstructor(options);
      rzp.open();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amount, userData],
  );

  // ── Step 4: Verify Payment ──
  const handleVerifyPayment = useCallback(
    async (response: RazorpaySuccessResponse, regId: number) => {
      setFlowState({
        status: PaymentFlowStatus.VERIFYING,
        registrationId: regId,
        errorMessage: null,
      });

      try {
        await verifyPaymentMutation.mutateAsync({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        setFlowState({
          status: PaymentFlowStatus.SUCCESS,
          registrationId: regId,
          errorMessage: null,
        });
      } catch {
        setFlowState({
          status: PaymentFlowStatus.ERROR,
          registrationId: regId,
          errorMessage:
            "Payment verification failed. If money was deducted, it will be refunded. Please contact support.",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Retry handler ──
  const handleRetry = () => {
    if (flowState.registrationId) {
      handleCreateOrder(flowState.registrationId);
    } else {
      handleStartPayment();
    }
  };

  // ════════════════════════════════════════════════════════════
  // Render based on flow status
  // ════════════════════════════════════════════════════════════

  // ── SUCCESS ─────────────────────────────────────────────────
  if (flowState.status === PaymentFlowStatus.SUCCESS) {
    return (
      <PaymentSuccessResult
        isManual={false}
        amount={amount}
        category={selectedPricing.category}
        token={token}
      />
    );
  }

  // ── MANUAL SUBMITTED ────────────────────────────────────────
  if (flowState.status === PaymentFlowStatus.MANUAL_SUBMITTED) {
    return (
      <PaymentSuccessResult
        isManual
        amount={amount}
        category={selectedPricing.category}
        token={token}
      />
    );
  }

  // ── MANUAL PAYMENT FORM ─────────────────────────────────────
  if (flowState.status === PaymentFlowStatus.MANUAL_PAYMENT) {
    return (
      <ManualPaymentStep
        token={token}
        registrationId={flowState.registrationId!}
        amount={amount}
        category={selectedPricing.category}
        onSuccess={() =>
          setFlowState((prev) => ({
            ...prev,
            status: PaymentFlowStatus.MANUAL_SUBMITTED,
          }))
        }
      />
    );
  }

  // ── PROCESSING STATES (Spin) ────────────────────────────────
  const isProcessing = [
    PaymentFlowStatus.REGISTERING,
    PaymentFlowStatus.ORDER_CREATING,
    PaymentFlowStatus.VERIFYING,
  ].includes(flowState.status);

  const processingMessages: Record<string, string> = {
    [PaymentFlowStatus.REGISTERING]: "Creating your registration...",
    [PaymentFlowStatus.ORDER_CREATING]: "Preparing payment order...",
    [PaymentFlowStatus.VERIFYING]: "Verifying your payment...",
  };

  if (flowState.status === PaymentFlowStatus.RAZORPAY_OPEN) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <SafetyOutlined
          style={{ fontSize: 48, color: token.colorPrimary, marginBottom: 16 }}
        />
        <Title level={4}>Complete Payment</Title>
        <Text type="secondary">
          Complete the payment in the Razorpay popup window.
          <br />
          Do not close this page.
        </Text>
      </div>
    );
  }

  return (
    <div>
      {/* Error Alert */}
      {flowState.status === PaymentFlowStatus.ERROR && (
        <Alert
          type="error"
          showIcon
          icon={<WarningOutlined />}
          message="Payment Error"
          description={flowState.errorMessage}
          style={{ marginBottom: 24, borderRadius: 10 }}
          action={
            <Button size="small" shape="round" onClick={handleRetry}>
              Retry
            </Button>
          }
        />
      )}

      {/* Processing spinner */}
      {isProcessing && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              {processingMessages[flowState.status]}
            </Text>
          </div>
        </div>
      )}

      {/* IDLE — Summary + Pay button */}
      {(flowState.status === PaymentFlowStatus.IDLE ||
        flowState.status === PaymentFlowStatus.ERROR) &&
        !isProcessing && (
          <div>
            {/* Payment Summary */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              <CreditCardOutlined
                style={{
                  fontSize: 36,
                  color: token.colorPrimary,
                  marginBottom: 8,
                }}
              />
              <Title level={4} style={{ marginBottom: 16 }}>
                Payment Summary
              </Title>

              <div
                style={{
                  display: "inline-block",
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: 14,
                  padding: "24px 40px",
                  minWidth: 280,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 40,
                    marginBottom: 12,
                  }}
                >
                  <Text type="secondary">Category</Text>
                  <Tag color="blue">{selectedPricing.category}</Tag>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text type="secondary">Amount</Text>
                  <Text
                    strong
                    style={{
                      fontSize: 22,
                      color: token.colorPrimary,
                    }}
                  >
                    ₹{amount.toLocaleString("en-IN")}
                  </Text>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 40,
              }}
            >
              <Button shape="round" size="large" onClick={onBack}>
                Back to Category
              </Button>
              <Button
                type="primary"
                shape="round"
                size="large"
                loading={registration.isPending}
                onClick={handleStartPayment}
              >
                Pay ₹{amount.toLocaleString("en-IN")}
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};
