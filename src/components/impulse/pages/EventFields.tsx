import { Form, Input, Select } from "antd";
import { createZodValidator } from "../../../validations/zodValidator";
import { createPageSchema } from "../../../validations/page.schemas";

const validator = (field: keyof typeof createPageSchema.shape) =>
  createZodValidator(createPageSchema, field, "registration");

const EventFields = () => {
  return (
    <>
      <Form.Item
        name="event_name"
        label="Event Name"
        rules={[{ validator: validator("event_name") }]}
      >
        <Input placeholder="e.g. Neuro Summit 2026" maxLength={150} />
      </Form.Item>

      <Form.Item
        name="event_description"
        label="Event Description"
        rules={[{ validator: validator("event_description") }]}
      >
        <Input.TextArea
          placeholder="Describe your event"
          maxLength={1000}
          showCount
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      </Form.Item>

      <Form.Item
        name="tags"
        label="Tags"
        rules={[{ validator: validator("tags") }]}
      >
        <Select
          mode="tags"
          placeholder="Type and press enter to add tags"
          maxCount={10}
          tokenSeparators={[","]}
          style={{ width: "100%" }}
        />
      </Form.Item>
    </>
  );
};

export default EventFields;
