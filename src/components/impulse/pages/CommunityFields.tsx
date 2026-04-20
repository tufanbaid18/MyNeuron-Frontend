import { Form, Input } from "antd";
import { createZodValidator } from "../../../validations/zodValidator";
import { createPageSchema } from "../../../validations/page.schemas";

const validator = (field: keyof typeof createPageSchema.shape) =>
  createZodValidator(createPageSchema, field, "registration");

const CommunityFields = () => {
  return (
    <Form.Item
      name="community_details"
      label="Community Details"
      rules={[{ validator: validator("community_details") }]}
    >
      <Input.TextArea
        placeholder="Describe your community and its purpose"
        maxLength={1000}
        showCount
        autoSize={{ minRows: 2, maxRows: 4 }}
      />
    </Form.Item>
  );
};

export default CommunityFields;
