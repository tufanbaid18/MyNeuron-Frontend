import { CheckCircleFilled, ClockCircleFilled } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { Button, Tag } from "antd";

import { APP_ROUTES } from "../../constants/app.routes";
import { env } from "../../constants/env";
import { useUserProfile } from "../../hooks/auth/useUserProfile";
import { RegisteredEventPaymentStatus } from "../../types/user/user.types";
import VirtualPassDialog from "./components/GatcVirtualPass";

export default function GATC2026() {
  const navigate = useNavigate();
  const { data: userData } = useUserProfile();

  // Check if user has already paid for the default GATC event
  const defaultEventId = Number(env.VITE_DEFAULT_GATC_EVENT_ID);
  const paymentStatus = userData?.registered_events?.find(
    (event) => event.event_id === defaultEventId,
  )?.payment_status;

  return (
    <section className="bg-white py-10 sm:py-14 lg:py-20 overflow-y-scroll h-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* IMAGE */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <img
            src="/images/GATC2026.png"
            alt="GATC Conference Banner"
            className="w-full h-[180px] sm:h-[240px] lg:h-[320px] object-cover rounded-2xl shadow-md"
          />
        </div>

        {/* CONTENT */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl text-center">
            {/* TITLE */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-600 mb-4 sm:mb-6">
              Genomic Advancements Through Convergence
            </h2>

            {/* TEXT */}
            <div className="space-y-4 sm:space-y-5 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                Welcome to Genomic Advancements Through Convergence — where
                cutting-edge genomics meets real-world impact.
              </p>

              <p>
                This flagship annual conference by Bencos Scientific Society
                brings together global leaders in translational genomics,
                precision medicine, and life sciences innovation.
              </p>

              <p>
                Held across key Indian cities, GATC — planned around a 3 day
                meeting concourse — serves as a unique platform for academia,
                industry, and policy-makers to converge. Join us as we bridge
                the gap from discovery to diagnostics, with the forum thrown
                open to a panel discussion on
                <strong> "Genomics for Impact: From Bench to Bedside".</strong>
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6 sm:mt-8">
              {paymentStatus &&
              (paymentStatus === RegisteredEventPaymentStatus.PAID ||
                paymentStatus ===
                  RegisteredEventPaymentStatus.MANUAL_VERIFIED) ? (
                <div className="flex flex-col justify-center items-center gap-5">
                  <Tag
                    icon={<CheckCircleFilled />}
                    color="success"
                    style={{
                      fontSize: 16,
                      padding: "8px 20px",
                      borderRadius: 20,
                    }}
                  >
                    Already Registered ✓
                  </Tag>
                  <VirtualPassDialog />
                </div>
              ) : paymentStatus &&
                paymentStatus ===
                  RegisteredEventPaymentStatus.MANUAL_PENDING ? (
                <Tag
                  icon={<ClockCircleFilled />}
                  color="warning"
                  style={{
                    fontSize: 16,
                    padding: "8px 20px",
                    borderRadius: 20,
                  }}
                >
                  Payment Verification in progress
                </Tag>
              ) : (
                <Button
                  size="large"
                  variant="outlined"
                  type="primary"
                  onClick={() => {
                    navigate({ to: APP_ROUTES.GATC_REGISTRATION });
                  }}
                >
                  Register now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
