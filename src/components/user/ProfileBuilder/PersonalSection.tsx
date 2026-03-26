import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Descriptions,
  Space,
  Select,
  Typography,
  Skeleton,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  usePersonalDetail,
  useUpdatePersonalDetail,
} from "../../../hooks/user/useUserPersonalDetails";
import {
  userPersonalDetailsSchema,
} from "../../../validations/user.schemas";
import type { UserPersonalDetailsForm } from "../../../validations/user.schemas";
import { createZodValidator } from "../../../validations/zodValidator";

const { TextArea } = Input;
const { Text } = Typography;

type PersonalSectionProps = {
  mode?: "profile" | "registration";
};

const PersonalSection: React.FC<PersonalSectionProps> = ({ mode = "profile" }) => {
  const [form] = Form.useForm<UserPersonalDetailsForm>();
  const { data: personalDetail, isLoading } = usePersonalDetail();
  const { mutateAsync: updateDetails, isPending } = useUpdatePersonalDetail();
  const [isEditingState, setIsEditingState] = useState(mode === "registration");

  const isEditing = isEditingState || (!isLoading && !personalDetail && mode === "profile");

  const setIsEditing = (val: boolean) => setIsEditingState(val);

  useEffect(() => {
    if (personalDetail && isEditing) {
      form.setFieldsValue({
        biosketch: personalDetail.biosketch || "",
        research_links: personalDetail.research_links || "",
        x_handle: personalDetail.x_handle || "",
        linkedin: personalDetail.linkedin || "",
        city: personalDetail.city || "",
        country: personalDetail.country || "",
        gender: personalDetail.gender || "",
        dob: personalDetail.dob || "",
        articles_journals: personalDetail.articles_journals || "",
        book_chapters: personalDetail.book_chapters || "",
      });
    }
  }, [personalDetail, isEditing, form]);

  const handleFinish = async (values: any) => {

    try {
      const payload = { ...values };
      
      // Django DateField throws a "wrong format" error for empty strings.
      // So if the user hasn't selected a date (empty string), we send null instead.
      if (payload.dob === "") {
        payload.dob = null;
      }

      await updateDetails(payload);
      if (mode === "profile") {
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const zodRule = (fieldName: keyof typeof userPersonalDetailsSchema.shape) => [
    {
      validator: createZodValidator(userPersonalDetailsSchema, fieldName, mode),
    },
  ];

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  if (!isEditing && personalDetail) {
    return (
      <div className="animate-fade-in transition-all">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>
            Personal Information Overview
          </Text>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            shape="round"
          >
            Edit
          </Button>
        </div>
        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Biosketch" span={2}>
            {personalDetail.biosketch || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="City">{personalDetail.city || "Not provided"}</Descriptions.Item>
          <Descriptions.Item label="Country">{personalDetail.country || "Not provided"}</Descriptions.Item>
          <Descriptions.Item label="Gender">{personalDetail.gender || "Not provided"}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">{personalDetail.dob || "Not provided"}</Descriptions.Item>
          <Descriptions.Item label="LinkedIn">{personalDetail.linkedin || "Not provided"}</Descriptions.Item>
          <Descriptions.Item label="X (Twitter) Handle">{personalDetail.x_handle || "Not provided"}</Descriptions.Item>
          <Descriptions.Item label="Research Links" span={2}>
            {personalDetail.research_links || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Articles & Journals" span={2}>
            {personalDetail.articles_journals || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Book Chapters" span={2}>
            {personalDetail.book_chapters || "Not provided"}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }

  return (
    <div className="animate-fade-in transition-all">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Text strong style={{ fontSize: 16 }}>
          Edit Personal Details
        </Text>
        {mode === "profile" && personalDetail && (
          <Button icon={<CloseOutlined />} onClick={() => setIsEditing(false)} shape="circle" />
        )}
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
        size="large"
      >
        <Form.Item
          name="biosketch"
          label={<span style={{ fontWeight: 500 }}>Biosketch</span>}
          rules={zodRule("biosketch")}
          hasFeedback
        >
          <TextArea rows={4} placeholder="Write a brief professional biosketch..." />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="city"
              label={<span style={{ fontWeight: 500 }}>City</span>}
              rules={zodRule("city")}
              hasFeedback
            >
              <Input placeholder="E.g., New York" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="country"
              label={<span style={{ fontWeight: 500 }}>Country</span>}
              rules={zodRule("country")}
              hasFeedback
            >
              <Input placeholder="E.g., USA" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="gender"
              label={<span style={{ fontWeight: 500 }}>Gender</span>}
              rules={zodRule("gender")}
              hasFeedback
            >
              <Select placeholder="Select gender">
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
                <Select.Option value="Prefer not to say">Prefer not to say</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="dob"
              label={<span style={{ fontWeight: 500 }}>Date of Birth</span>}
              rules={zodRule("dob")}
              hasFeedback
              getValueProps={(value) => ({ value: value ? dayjs(value) : "" })}
              getValueFromEvent={(_, dateString) => dateString}
            >
              {/* Used AntD DatePicker to cleanly output YYYY-MM-DD */}
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="linkedin"
              label={<span style={{ fontWeight: 500 }}>LinkedIn Profile URL</span>}
              rules={zodRule("linkedin")}
              hasFeedback
            >
              <Input placeholder="https://linkedin.com/in/yourprofile" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="x_handle"
              label={<span style={{ fontWeight: 500 }}>X (Twitter) Handle</span>}
              rules={zodRule("x_handle")}
              hasFeedback
            >
              <Input placeholder="@yourhandle" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="research_links"
          label={<span style={{ fontWeight: 500 }}>Research Links (e.g., Google Scholar, ORCID)</span>}
          rules={zodRule("research_links")}
          hasFeedback
        >
          <TextArea rows={2} placeholder="Provide links separating them by commas or new lines" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="articles_journals"
              label={<span style={{ fontWeight: 500 }}>Articles & Journals</span>}
              rules={zodRule("articles_journals")}
              hasFeedback
            >
              <TextArea rows={3} placeholder="List your key articles and journals..." />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="book_chapters"
              label={<span style={{ fontWeight: 500 }}>Book Chapters</span>}
              rules={zodRule("book_chapters")}
              hasFeedback
            >
              <TextArea rows={3} placeholder="List your book chapters..." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              icon={<SaveOutlined />}
              shape="round"
              size="large"
            >
              Save Personal Details
            </Button>
            {mode === "profile" && personalDetail && (
              <Button onClick={() => setIsEditing(false)} shape="round" size="large">
                Cancel
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PersonalSection;
