import { PhoneOutlined } from "@ant-design/icons";
import { Col, Divider, Form, Input, Row, Space, Typography } from "antd";
import type { GlobalToken } from "antd/es/theme/interface";

const { Text } = Typography;

interface ContactDetailsSectionProps {
  token: GlobalToken;
}

export const ContactDetailsSection = ({
  token,
}: ContactDetailsSectionProps) => {
  return (
    <>
      <Divider titlePlacement="left" style={{ marginTop: 32 }}>
        <Space>
          <PhoneOutlined style={{ color: token.colorPrimary }} />
          <Text strong style={{ fontSize: 16, color: token.colorPrimary }}>
            Contact Details
          </Text>
        </Space>
      </Divider>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="contact_number"
            label={<span style={{ fontWeight: 500 }}>Contact Number</span>}
            rules={[{ required: true, message: "Contact number is required" }]}
          >
            <Input placeholder="+91 98765 43210" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="website"
            label={<span style={{ fontWeight: 500 }}>Website (Optional)</span>}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            name="work_address"
            label={<span style={{ fontWeight: 500 }}>Work Address</span>}
            rules={[{ required: true, message: "Work address is required" }]}
          >
            <Input.TextArea rows={3} placeholder="Full work address" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
