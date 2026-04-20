import { Form, Input } from "antd";
import { createZodValidator } from "../../../validations/zodValidator";
import { createPageSchema } from "../../../validations/page.schemas";

const validator = (field: keyof typeof createPageSchema.shape) =>
  createZodValidator(createPageSchema, field, "registration");

const CompanyFields = () => {
  return (
    <>
      <Form.Item
        name="company_name"
        label="Company Name"
        rules={[{ validator: validator("company_name") }]}
      >
        <Input placeholder="e.g. NeuroTech Pvt Ltd" maxLength={150} />
      </Form.Item>

      <Form.Item
        name="official_website"
        label="Official Website"
        rules={[{ validator: validator("official_website") }]}
      >
        <Input placeholder="https://yourcompany.com" maxLength={200} />
      </Form.Item>

      <Form.Item
        name="company_bio"
        label="Company Bio"
        rules={[{ validator: validator("company_bio") }]}
      >
        <Input.TextArea
          placeholder="Briefly describe your company"
          maxLength={500}
          showCount
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      </Form.Item>

      <Form.Item
        name="cin"
        label="CIN (Corporate Identity Number)"
        rules={[{ validator: validator("cin") }]}
      >
        <Input placeholder="e.g. U12345ABC" maxLength={30} />
      </Form.Item>
    </>
  );
};

export default CompanyFields;
