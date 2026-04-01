import {
  CloudUploadOutlined,
  InfoCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Form,
  Image,
  Input,
  Typography,
  Upload,
  message,
} from "antd";
import type { GlobalToken } from "antd/es/theme/interface";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";

import { GATC_CONSTANTS } from "../../../../constants/gatc.constants";
import { useManualPayment } from "../../../../hooks/gatc/useGatcPayment";
import { manualPaymentSchema } from "../../../../validations/gatc.schemas";

// ════════════════════════════════════════════════════════════════
// ManualPaymentStep — Fallback when Razorpay fails 3 times
// Shows QR code, collects transaction ID + screenshot.
// ════════════════════════════════════════════════════════════════

const { Text, Paragraph } = Typography;

type ManualPaymentStepProps = {
  token: GlobalToken;
  registrationId: number;
  amount: number;
  category: string;
  onSuccess: () => void;
};

export const ManualPaymentStep = ({
  token,
  registrationId,
  amount,
  category,
  onSuccess,
}: ManualPaymentStepProps) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const manualPayment = useManualPayment();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const file = fileList[0]?.originFileObj;

      if (!file) {
        message.error("Please upload a payment screenshot.");
        return;
      }

      // Validate with Zod before sending
      const parsed = manualPaymentSchema.safeParse({
        transaction_id: values.transaction_id,
        screenshot: file,
      });

      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        message.error(firstError.message);
        return;
      }

      const formData = new FormData();
      formData.append("registration", String(registrationId));
      formData.append("transaction_id", parsed.data.transaction_id);
      formData.append("screenshot", file);

      await manualPayment.mutateAsync(formData);
      message.success("Payment submitted successfully!");
      onSuccess();
    } catch {
      // Form validation errors are handled by AntD inline
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      {/* Info banner */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message="Online Payment Unavailable"
        description="Please complete your payment manually via UPI using the QR code below, then upload the screenshot."
        style={{ marginBottom: 24, borderRadius: 10 }}
      />

      {/* Summary */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 24,
          padding: "16px 24px",
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: 12,
        }}
      >
        <Text type="secondary">Pay for</Text>
        <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>
          {category}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: token.colorPrimary,
            marginTop: 4,
          }}
        >
          ₹{amount.toLocaleString("en-IN")}
        </div>
      </div>

      {/* QR Code */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Image
          src={GATC_CONSTANTS.UPI_QR_IMAGE_PATH}
          alt="UPI QR Code"
          width={220}
          style={{ borderRadius: 12, border: `1px solid ${token.colorBorder}` }}
          preview={false}
        />
        <Paragraph
          type="secondary"
          style={{ marginTop: 8, fontSize: 12 }}
        >
          Scan this QR code with any UPI app to make the payment
        </Paragraph>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          name="transaction_id"
          label="UPI Transaction ID"
          rules={[
            { required: true, message: "Transaction ID is required" },
            { max: 50, message: "Transaction ID is too long" },
          ]}
        >
          <Input
            placeholder="e.g. UPI123456789"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          label="Payment Screenshot"
          required
          help={`JPEG, PNG, or WebP • Max ${GATC_CONSTANTS.MAX_SCREENSHOT_SIZE_MB}MB`}
        >
          <Upload.Dragger
            fileList={fileList}
            maxCount={1}
            accept={GATC_CONSTANTS.ALLOWED_SCREENSHOT_TYPES.join(",")}
            beforeUpload={(file) => {
              const isValidType =
                GATC_CONSTANTS.ALLOWED_SCREENSHOT_TYPES.includes(file.type);
              if (!isValidType) {
                message.error("Only JPEG, PNG, and WebP images are allowed.");
                return Upload.LIST_IGNORE;
              }

              const isValidSize =
                file.size <=
                GATC_CONSTANTS.MAX_SCREENSHOT_SIZE_MB * 1024 * 1024;
              if (!isValidSize) {
                message.error(
                  `File must be under ${GATC_CONSTANTS.MAX_SCREENSHOT_SIZE_MB}MB.`,
                );
                return Upload.LIST_IGNORE;
              }

              return false; // Prevent auto-upload
            }}
            onChange={({ fileList: newList }) => setFileList(newList)}
            listType="picture"
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined
                style={{ fontSize: 36, color: token.colorPrimary }}
              />
            </p>
            <p className="ant-upload-text">
              Click or drag your screenshot here
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>

      <Button
        type="primary"
        size="large"
        block
        shape="round"
        loading={manualPayment.isPending}
        disabled={fileList.length === 0}
        onClick={handleSubmit}
        style={{ marginBottom: 16 }}
      >
        Submit Payment Proof
      </Button>

      {/* Support */}
      <div style={{ textAlign: "center" }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Need help?{" "}
          <Button
            type="link"
            size="small"
            href={`mailto:${GATC_CONSTANTS.SUPPORT_EMAIL}`}
            icon={<MailOutlined />}
            style={{ padding: 0, fontSize: 12 }}
          >
            {GATC_CONSTANTS.SUPPORT_EMAIL}
          </Button>
        </Text>
      </div>
    </div>
  );
};
