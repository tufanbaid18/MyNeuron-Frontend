import { CheckOutlined, CreditCardOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Skeleton,
  Typography,
} from "antd";
import type { GlobalToken } from "antd/es/theme/interface";

import { useDefaultEvent } from "../../../../hooks/gatc/useGatcPayment";
import type { EventPricing } from "../../../../types/gatc/gatc.types";

const { Text, Title } = Typography;

// ════════════════════════════════════════════════════════════════
// CategoryStep — Pricing selection from API data
// ════════════════════════════════════════════════════════════════

type CategoryStepProps = {
  token: GlobalToken;
  selectedPricing: EventPricing | null;
  onPricingSelect: (pricing: EventPricing) => void;
  onBack: () => void;
  onNext: () => void;
};

export const CategoryStep = ({
  token,
  selectedPricing,
  onPricingSelect,
  onBack,
  onNext,
}: CategoryStepProps) => {
  const { data: event, isLoading, isError } = useDefaultEvent();

  // ── Loading ──
  if (isLoading) {
    return (
      <div style={{ padding: "40px 0" }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  // ── Event not found ──
  if (isError || !event) {
    return (
      <Alert
        type="error"
        showIcon
        message="Event Not Found"
        description="Could not load registration categories. Please try again or contact support."
        style={{ borderRadius: 10 }}
        action={
          <Button shape="round" onClick={onBack}>
            Go Back
          </Button>
        }
      />
    );
  }

  // ── Empty pricing ──
  if (event.pricing.length === 0) {
    return (
      <Empty
        description="No registration categories available at this time."
        style={{ padding: "60px 0" }}
      >
        <Button shape="round" onClick={onBack}>
          Go Back
        </Button>
      </Empty>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <CreditCardOutlined
          style={{ fontSize: 36, color: token.colorPrimary, marginBottom: 8 }}
        />
        <Title level={4} style={{ marginBottom: 4 }}>
          Select Registration Category
        </Title>
        <Text type="secondary">{event.name}</Text>
      </div>

      {/* Pricing Cards */}
      <Row gutter={[16, 16]} justify="center">
        {event.pricing.map((pricing) => {
          const isSelected = selectedPricing?.id === pricing.id;
          const priceNum = parseFloat(pricing.price);

          return (
            <Col key={pricing.id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                onClick={() => onPricingSelect(pricing)}
                style={{
                  borderRadius: 14,
                  border: isSelected
                    ? `2px solid ${token.colorPrimary}`
                    : `1px solid ${token.colorBorderSecondary}`,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${token.colorPrimaryBg}`
                    : undefined,
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                styles={{
                  body: {
                    padding: "24px 20px",
                    textAlign: "center",
                  },
                }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: token.colorPrimary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckOutlined
                      style={{ color: "#fff", fontSize: 12 }}
                    />
                  </div>
                )}

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    display: "block",
                    marginBottom: 8,
                    color: isSelected
                      ? token.colorPrimary
                      : token.colorText,
                  }}
                >
                  {pricing.category}
                </Text>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: isSelected
                      ? token.colorPrimary
                      : token.colorTextHeading,
                    lineHeight: 1.2,
                  }}
                >
                  ₹{priceNum.toLocaleString("en-IN")}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 40,
        }}
      >
        <Button shape="round" size="large" onClick={onBack}>
          Back to Details
        </Button>
        <Button
          type="primary"
          shape="round"
          size="large"
          disabled={!selectedPricing}
          onClick={onNext}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};
