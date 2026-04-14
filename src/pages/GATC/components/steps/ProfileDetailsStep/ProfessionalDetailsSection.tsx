import { Col, Divider, Form, Input, Row, Space, Typography } from "antd";
import type { GlobalToken } from "antd/es/theme/interface";
import { IoBriefcaseOutline } from "react-icons/io5";
import { maxLengthValidator } from "../../../../../validations/common.validation";

const { Text } = Typography;

interface ProfessionalDetailsSectionProps {
  token: GlobalToken;
}

export const ProfessionalDetailsSection = ({
  token,
}: ProfessionalDetailsSectionProps) => {
  return (
    <>
      <Divider titlePlacement="left" style={{ marginTop: 32 }}>
        <Space>
          <span
            className="anticon"
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: token.colorPrimary,
            }}
          >
            <IoBriefcaseOutline />
          </span>
          <Text strong style={{ fontSize: 16, color: token.colorPrimary }}>
            Professional Details
          </Text>
        </Space>
      </Divider>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            name="current_organization"
            label={<span style={{ fontWeight: 500 }}>Organization</span>}
            rules={[
              { required: true, message: "Organization is required" },
              {
                validator: (_, value) => maxLengthValidator({ value }),
              },
            ]}
          >
            <Input placeholder="e.g., Harvard University" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="current_role"
            label={<span style={{ fontWeight: 500 }}>Role</span>}
            rules={[
              { required: true, message: "Role is required" },
              {
                validator: (_, value) => maxLengthValidator({ value }),
              },
            ]}
          >
            <Input placeholder="e.g., Principal Investigator" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="current_department"
            label={<span style={{ fontWeight: 500 }}>Department</span>}
            rules={[
              { required: true, message: "Department is required" },
              {
                validator: (_, value) =>
                  maxLengthValidator({ value, maxLength: 100 }),
              },
            ]}
          >
            <Input placeholder="e.g., Neuroscience" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
