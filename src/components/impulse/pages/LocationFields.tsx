import { Col, Form, Input, Row } from "antd";
import { createZodValidator } from "../../../validations/zodValidator";
import { createPageSchema } from "../../../validations/page.schemas";

const validator = (field: keyof typeof createPageSchema.shape) =>
  createZodValidator(createPageSchema, field, "registration");

const LocationFields = () => {
  return (
    <>
      <Form.Item
        name="website"
        label="Website"
        rules={[{ validator: validator("website") }]}
      >
        <Input placeholder="https://yourpage.com" maxLength={200} />
      </Form.Item>

      <Row gutter={12}>
        <Col span={8}>
          <Form.Item
            name="state"
            label="State"
            rules={[{ validator: validator("state") }]}
          >
            <Input placeholder="e.g. West Bengal" maxLength={100} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="zip"
            label="ZIP Code"
            rules={[{ validator: validator("zip") }]}
          >
            <Input placeholder="e.g. 700001" maxLength={10} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ validator: validator("country") }]}
          >
            <Input placeholder="e.g. India" maxLength={100} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default LocationFields;
