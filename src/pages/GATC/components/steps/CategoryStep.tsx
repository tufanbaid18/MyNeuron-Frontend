import { CreditCardOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import type { GlobalToken } from "antd/es/theme/interface";

interface CategoryStepProps {
  token: GlobalToken;
  onBack: () => void;
  onNext: () => void;
}

export const CategoryStep = ({ token, onBack, onNext }: CategoryStepProps) => {
  return (
    <div>
      <Result
        icon={<CreditCardOutlined style={{ color: token.colorPrimary }} />}
        title="Select Registration Category"
        subTitle="Category selection and pricing will be implemented here."
        extra={[
          <Button key="back" shape="round" onClick={onBack}>
            Back to Details
          </Button>,
          <Button
            key="next"
            type="primary"
            shape="round"
            onClick={onNext}
            disabled
          >
            Proceed to Payment
          </Button>,
        ]}
      />

      {/* TODO: Implement category selection cards
                 - Country-based pricing (India vs International)
                 - 3 categories: Students, Faculty, Industry
                 - Each card shows price label
                 - On select → setSelectedPlan({ category, price })
                 - On continue → handleProceedToPayment()
              */}
    </div>
  );
};
