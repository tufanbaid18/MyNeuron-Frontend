import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import type { GlobalToken } from "antd/es/theme/interface";

interface PaymentStepProps {
  token: GlobalToken;
  onBack: () => void;
}

export const PaymentStep = ({ token, onBack }: PaymentStepProps) => {
  return (
    <div>
      <Result
        icon={<CheckCircleOutlined style={{ color: token.colorPrimary }} />}
        title="Payment"
        subTitle="QR code generation and payment instructions will be implemented here."
        extra={[
          <Button key="back" shape="round" onClick={onBack}>
            Back to Category
          </Button>,
          <Button key="submit" type="primary" shape="round" disabled>
            Submit Registration
          </Button>,
        ]}
      />

      {/* TODO: Implement payment step
                 - Call getQRcode(upiUrl) to generate QR
                 - Display QR image
                 - Show payment amount
                 - Show email instructions (info@bencoslife.com)
                 - Submit registration button
              */}
    </div>
  );
};
