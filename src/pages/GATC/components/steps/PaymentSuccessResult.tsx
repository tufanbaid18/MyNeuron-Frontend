import {
  CheckCircleOutlined,
  MailOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Result, Tag, Typography } from "antd";
import type { GlobalToken } from "antd/es/theme/interface";

const { Text, Paragraph } = Typography;

import { GATC_CONSTANTS } from "../../../../constants/gatc.constants";

// ════════════════════════════════════════════════════════════════
// PaymentSuccessResult — Shared success screen
// Used after both Razorpay verification and manual submission.
// ════════════════════════════════════════════════════════════════

type PaymentSuccessResultProps = {
  isManual: boolean;
  amount: number;
  category: string;
  token: GlobalToken;
};

export const PaymentSuccessResult = ({
  isManual,
  amount,
  category,
  token,
}: PaymentSuccessResultProps) => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "24px 0",
      }}
    >
      <Result
        icon={
          isManual ? (
            <SmileOutlined style={{ color: token.colorWarning }} />
          ) : (
            <CheckCircleOutlined style={{ color: token.colorSuccess }} />
          )
        }
        title={
          isManual
            ? "Payment Submitted for Verification"
            : "Payment Successful! 🎉"
        }
        subTitle={
          isManual
            ? "Your manual payment has been received. Our team will verify it shortly."
            : "Your GATC 2026 registration is now confirmed."
        }
        extra={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Summary card */}
            <div
              style={{
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: 12,
                padding: "20px 32px",
                minWidth: 260,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text type="secondary">Category</Text>
                <Tag color="blue">{category}</Tag>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Text type="secondary">Amount</Text>
                <Text strong style={{ fontSize: 16 }}>
                  ₹{amount.toLocaleString("en-IN")}
                </Text>
              </div>
            </div>

            {isManual && (
              <Paragraph
                type="secondary"
                style={{ maxWidth: 400, marginTop: 8 }}
              >
                You'll receive a confirmation email once your payment is
                verified. For questions, contact{" "}
                <Button
                  type="link"
                  href={`mailto:${GATC_CONSTANTS.SUPPORT_EMAIL}`}
                  style={{ padding: 0 }}
                  icon={<MailOutlined />}
                >
                  {GATC_CONSTANTS.SUPPORT_EMAIL}
                </Button>
              </Paragraph>
            )}

            {!isManual && (
              <Paragraph
                type="secondary"
                style={{ maxWidth: 400, marginTop: 8 }}
              >
                A confirmation email has been sent. We look forward to seeing
                you at GATC 2026!
              </Paragraph>
            )}
          </div>
        }
      />
    </div>
  );
};
