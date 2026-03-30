import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { GlobalToken } from "antd/es/theme/interface";

const { Text } = Typography;

interface PersonalDetailsSectionProps {
  token: GlobalToken;
}

export const PersonalDetailsSection = ({
  token,
}: PersonalDetailsSectionProps) => {
  return (
    <>
      <Divider titlePlacement="left">
        <Space>
          <IdcardOutlined style={{ color: token.colorPrimary }} />
          <Text strong style={{ fontSize: 16, color: token.colorPrimary }}>
            Personal Details
          </Text>
        </Space>
      </Divider>

      <Row gutter={16}>
        <Col xs={24} md={4}>
          <Form.Item
            name="title"
            label={<span style={{ fontWeight: 500 }}>Title</span>}
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Select placeholder="—">
              <Select.Option value="Prof">Prof</Select.Option>
              <Select.Option value="Dr">Dr</Select.Option>
              <Select.Option value="Mr">Mr</Select.Option>
              <Select.Option value="Ms">Ms</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={7}>
          <Form.Item
            name="first_name"
            label={<span style={{ fontWeight: 500 }}>First Name</span>}
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input placeholder="First name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item
            name="middle_name"
            label={<span style={{ fontWeight: 500 }}>Middle Name</span>}
          >
            <Input placeholder="Optional" />
          </Form.Item>
        </Col>
        <Col xs={24} md={7}>
          <Form.Item
            name="last_name"
            label={<span style={{ fontWeight: 500 }}>Last Name</span>}
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input placeholder="Last name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="gender"
            label={<span style={{ fontWeight: 500 }}>Gender</span>}
            rules={[{ required: true, message: "Gender is required" }]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="dob"
            label={<span style={{ fontWeight: 500 }}>Date of Birth</span>}
            rules={[{ required: true, message: "Date of birth is required" }]}
            getValueProps={(value) => ({
              value: value && value !== "" ? dayjs(value) : undefined,
            })}
            getValueFromEvent={(_, dateString) => dateString}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="city"
            label={<span style={{ fontWeight: 500 }}>City</span>}
            rules={[{ required: true, message: "City is required" }]}
          >
            <Input placeholder="e.g., New York" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="country"
            label={<span style={{ fontWeight: 500 }}>Country</span>}
            rules={[{ required: true, message: "Country is required" }]}
          >
            <Input placeholder="e.g., India" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
