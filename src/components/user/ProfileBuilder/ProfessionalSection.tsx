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
  Card,
  InputNumber,
  Divider,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useProfessionalDetail,
  useUpdateProfessionalDetail,
} from "../../../hooks/user/useUserProfessionalDetails";
import { userProfessionalDetailsSchema } from "../../../validations/user.schemas";
import type { UserProfessionalDetailsForm } from "../../../validations/user.schemas";
import { createZodValidator } from "../../../validations/zodValidator";

const { TextArea } = Input;
const { Text, Title } = Typography;

type ProfessionalSectionProps = {
  mode?: "profile" | "registration";
};

const ProfessionalSection: React.FC<ProfessionalSectionProps> = ({
  mode = "profile",
}) => {
  const [form] = Form.useForm<UserProfessionalDetailsForm>();
  const { data: profDetail, isLoading } = useProfessionalDetail();
  const { mutateAsync: updateDetails, isPending } =
    useUpdateProfessionalDetail();
  const [isEditingState, setIsEditingState] = useState(mode === "registration");

  const isEditing =
    isEditingState || (!isLoading && !profDetail && mode === "profile");

  const setIsEditing = (val: boolean) => setIsEditingState(val);

  useEffect(() => {
    if (profDetail && isEditing) {
      form.setFieldsValue({
        current_role: profDetail.current_role || "",
        current_organization: profDetail.current_organization || "",
        current_department: profDetail.current_department || "",
        current_start_month: profDetail.current_start_month || 1,
        current_start_year:
          profDetail.current_start_year || new Date().getFullYear(),
        current_description: profDetail.current_description || "",
        work_email: profDetail.work_email || "",
        contact_number: profDetail.contact_number || "",
        emergency_contact_number: profDetail.emergency_contact_number || "",
        website: profDetail.website || "",
        lab: profDetail.lab || "",
        work_address: profDetail.work_address || "",
        skill_set: profDetail.skill_set || "",
        languages_spoken: profDetail.languages_spoken || "",
        certifications: profDetail.certifications || "",
        past_experiences: profDetail.past_experiences || [],
      });
    }
  }, [profDetail, isEditing, form]);

  const handleFinish = async (values: UserProfessionalDetailsForm) => {
    try {
      // Backend expects `certifications` as a FileField, not text.
      // Exclude it from the regular PATCH payload to avoid the encoding error.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { certifications: _, ...payload } = values;
      await updateDetails(payload);
      if (mode === "profile") setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const zodRule = (
    fieldName: keyof typeof userProfessionalDetailsSchema.shape,
  ) => [
    {
      validator: createZodValidator(
        userProfessionalDetailsSchema,
        fieldName,
        mode,
      ),
    },
  ];

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  if (!isEditing && profDetail) {
    return (
      <div className="animate-fade-in transition-all">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            Professional Background Overview
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

        <Title level={5}>Current Position</Title>
        <Descriptions
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="Role">
            {profDetail.current_role || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Organization">
            {profDetail.current_organization || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            {profDetail.current_department || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {profDetail.current_start_month}/{profDetail.current_start_year}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {profDetail.current_description || "Not provided"}
          </Descriptions.Item>
        </Descriptions>

        <Title level={5}>Contact & Lab Information</Title>
        <Descriptions
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="Work Email">
            {profDetail.work_email || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Number">
            {profDetail.contact_number || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Emergency Contact">
            {profDetail.emergency_contact_number || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Website">
            {profDetail.website || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Lab">
            {profDetail.lab || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Work Address">
            {profDetail.work_address || "Not provided"}
          </Descriptions.Item>
        </Descriptions>

        <Title level={5}>Skills & Credentials</Title>
        <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Skills">
            {profDetail.skill_set || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Languages">
            {profDetail.languages_spoken || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Certifications">
            {profDetail.certifications || "Not provided"}
          </Descriptions.Item>
        </Descriptions>

        {profDetail.past_experiences &&
          profDetail.past_experiences.length > 0 && (
            <>
              <Title level={5} style={{ marginTop: 24 }}>
                Past Experiences
              </Title>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {profDetail.past_experiences.map(
                  (
                    exp: import("../../../types/user/user.types").UserPastProfessionalDetails,
                    index: number,
                  ) => (
                    <Card
                      key={exp.id || index}
                      size="small"
                      title={`${exp.role} at ${exp.organization}`}
                    >
                      <Text type="secondary">
                        {exp.department} | {exp.start_month}/{exp.start_year} -{" "}
                        {exp.end_month}/{exp.end_year}
                      </Text>
                      <p style={{ marginTop: 8, marginBottom: 0 }}>
                        {exp.description}
                      </p>
                    </Card>
                  ),
                )}
              </div>
            </>
          )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in transition-all">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          Edit Professional Details
        </Text>
        {mode === "profile" && profDetail && (
          <Button
            icon={<CloseOutlined />}
            onClick={() => setIsEditing(false)}
            shape="circle"
          />
        )}
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
        size="large"
      >
        <Divider>Current Position</Divider>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="current_role"
              label={<span style={{ fontWeight: 500 }}>Current Role</span>}
              rules={zodRule("current_role")}
              hasFeedback
            >
              <Input placeholder="e.g. Principal Investigator" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="current_organization"
              label={<span style={{ fontWeight: 500 }}>Organization</span>}
              rules={zodRule("current_organization")}
              hasFeedback
            >
              <Input placeholder="e.g. Harvard University" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="current_department"
              label={<span style={{ fontWeight: 500 }}>Department</span>}
              rules={zodRule("current_department")}
              hasFeedback
            >
              <Input placeholder="e.g. Neuroscience" />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item
              name="current_start_month"
              label={<span style={{ fontWeight: 500 }}>Start Month</span>}
              rules={zodRule("current_start_month")}
              hasFeedback
            >
              <Select placeholder="Month">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <Select.Option key={m} value={m}>
                    {new Date(0, m - 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item
              name="current_start_year"
              label={<span style={{ fontWeight: 500 }}>Start Year</span>}
              rules={zodRule("current_start_year")}
              hasFeedback
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1900}
                max={new Date().getFullYear()}
                placeholder="YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="current_description"
          label={<span style={{ fontWeight: 500 }}>Role Description</span>}
          rules={zodRule("current_description")}
          hasFeedback
        >
          <TextArea
            rows={3}
            placeholder="Describe your current responsibilities..."
          />
        </Form.Item>

        <Divider>Contact & Work Coordinates</Divider>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="work_email"
              label={<span style={{ fontWeight: 500 }}>Work Email</span>}
              rules={zodRule("work_email")}
              hasFeedback
            >
              <Input type="email" placeholder="example@institute.edu" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="contact_number"
              label={<span style={{ fontWeight: 500 }}>Contact Number</span>}
              rules={zodRule("contact_number")}
              hasFeedback
            >
              <Input placeholder="+1 234 567 8900" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="emergency_contact_number"
              label={<span style={{ fontWeight: 500 }}>Emergency Contact</span>}
              rules={zodRule("emergency_contact_number")}
              hasFeedback
            >
              <Input placeholder="+1 987 654 3210" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="website"
              label={
                <span style={{ fontWeight: 500 }}>
                  Personal Website/Portfolio (Optional)
                </span>
              }
              rules={zodRule("website")}
              hasFeedback
            >
              <Input placeholder="https://mywebsite.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="lab"
              label={<span style={{ fontWeight: 500 }}>Lab Details</span>}
              rules={zodRule("lab")}
              hasFeedback
            >
              <Input placeholder="Name of your laboratory" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="work_address"
              label={<span style={{ fontWeight: 500 }}>Work Address</span>}
              rules={zodRule("work_address")}
              hasFeedback
            >
              <TextArea rows={1} placeholder="Full building address" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Skills & Extras</Divider>
        <Form.Item
          name="skill_set"
          label={<span style={{ fontWeight: 500 }}>Skill Set</span>}
          rules={zodRule("skill_set")}
          hasFeedback
        >
          <Input placeholder="Microscopy, Data Analysis, Python..." />
        </Form.Item>
        <Form.Item
          name="languages_spoken"
          label={<span style={{ fontWeight: 500 }}>Languages Spoken</span>}
          rules={zodRule("languages_spoken")}
          hasFeedback
        >
          <Input placeholder="English, Spanish, Mandarin..." />
        </Form.Item>
        <Form.Item
          name="certifications"
          label={
            <span style={{ fontWeight: 500 }}>
              Certifications (Optional — file upload coming soon)
            </span>
          }
          hasFeedback
        >
          <TextArea
            rows={2}
            placeholder="List major certifications..."
            disabled
          />
        </Form.Item>

        <Divider>Past Experiences</Divider>
        <Form.List name="past_experiences">
          {(fields, { add, remove }) => (
            <div
              style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
            >
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  size="small"
                  title={`Experience ${name + 1}`}
                  key={key}
                  extra={
                    <CloseOutlined
                      onClick={() => remove(name)}
                      style={{ color: "red" }}
                    />
                  }
                  style={{ background: "#fcfcfc" }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "role"]}
                        rules={[{ required: true, message: "Required" }]}
                        label="Role"
                      >
                        <Input placeholder="e.g. Postdoc" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "organization"]}
                        rules={[{ required: true, message: "Required" }]}
                        label="Organization"
                      >
                        <Input placeholder="e.g. MIT" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "department"]}
                        rules={[{ required: true, message: "Required" }]}
                        label="Department"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "start_month"]}
                        rules={[{ required: true, message: "Required" }]}
                        label="Start Month"
                      >
                        <InputNumber
                          min={1}
                          max={12}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "start_year"]}
                        rules={[{ required: true, message: "Required" }]}
                        label="Start Year"
                      >
                        <InputNumber
                          min={1900}
                          max={2100}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "end_month"]}
                        rules={[{ required: true, message: "Required" }]}
                        label="End Month"
                      >
                        <InputNumber
                          min={1}
                          max={12}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "end_year"]}
                        rules={[{ required: true, message: "Required" }]}
                        label="End Year"
                      >
                        <InputNumber
                          min={1900}
                          max={2100}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    rules={[{ required: true, message: "Required" }]}
                    label="Description"
                  >
                    <TextArea rows={2} />
                  </Form.Item>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Past Experience
              </Button>
            </div>
          )}
        </Form.List>

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              icon={<SaveOutlined />}
              shape="round"
              size="large"
            >
              Save Professional Details
            </Button>
            {mode === "profile" && profDetail && (
              <Button
                onClick={() => setIsEditing(false)}
                shape="round"
                size="large"
              >
                Cancel
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfessionalSection;
