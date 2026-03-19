import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Skeleton,
  Space,
  Row,
  Col,
  Tag,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useScientificInterest,
  useUpdateScientificInterest,
} from "../../../hooks/user/useUserScientificInterests";
import {
  userScientificInterestSchema,
  type UserScientificInterestForm,
} from "../../../validations/user.schemas";
import { createZodValidator } from "../../../validations/zodValidator";

const { TextArea } = Input;
const { Text, Title } = Typography;

type ScientificInterestSectionProps = {
  mode?: "profile" | "registration";
};

const ScientificInterestSection: React.FC<ScientificInterestSectionProps> = ({
  mode = "profile",
}) => {
  const [form] = Form.useForm<UserScientificInterestForm>();
  const { data: scientificInt, isLoading } = useScientificInterest();
  const { mutateAsync: updateInterest, isPending } =
    useUpdateScientificInterest();
  const [isEditingState, setIsEditingState] = useState(mode === "registration");

  const isEditing =
    isEditingState || (!isLoading && !scientificInt && mode === "profile");

  const setIsEditing = (val: boolean) => setIsEditingState(val);

  useEffect(() => {
    if (scientificInt && isEditing) {
      form.setFieldsValue({
        research_area_of_expertise:
          scientificInt.research_area_of_expertise || "",
        major_focus: scientificInt.major_focus || [],
        specific_research_areas: scientificInt.specific_research_areas || [],
        organ_sites: scientificInt.organ_sites || [],
        additional_research_areas:
          scientificInt.additional_research_areas || [],
        brief_description: scientificInt.brief_description || "",
      });
    }
  }, [scientificInt, isEditing, form]);

  const handleFinish = async (values: UserScientificInterestForm) => {

    try {
      await updateInterest(values);
      if (mode === "profile") {
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const zodRule = (
    fieldName: keyof typeof userScientificInterestSchema.shape,
  ) => [
    {
      validator: createZodValidator(userScientificInterestSchema, fieldName, mode),
    },
  ];

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  const renderTags = (tags: string[] | undefined) => {
    if (!tags || tags.length === 0)
      return <Text type="secondary">None specified</Text>;
    return (
      <Space size={[0, 8]} wrap>
        {tags.map((tag) => (
          <Tag color="cyan" key={tag}>
            {tag}
          </Tag>
        ))}
      </Space>
    );
  };

  if (!isEditing && scientificInt) {
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
            Scientific Interests Overview
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

        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Title level={5}>Research Area of Expertise</Title>
            <Text>
              {scientificInt.research_area_of_expertise || "Not provided"}
            </Text>
          </Col>
        </Row>

        <Row gutter={[16, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Title level={5}>Major Focus</Title>
            {renderTags(scientificInt.major_focus)}
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Specific Research Areas</Title>
            {renderTags(scientificInt.specific_research_areas)}
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Organ Sites</Title>
            {renderTags(scientificInt.organ_sites)}
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Additional Research Areas</Title>
            {renderTags(scientificInt.additional_research_areas)}
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Title level={5}>Brief Description</Title>
            <Text>{scientificInt.brief_description || "Not provided"}</Text>
          </Col>
        </Row>
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
          Edit Scientific Interests
        </Text>
        {mode === "profile" && scientificInt && (
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
        <Form.Item
          name="research_area_of_expertise"
          label={
            <span style={{ fontWeight: 500 }}>Research Area of Expertise</span>
          }
          rules={zodRule("research_area_of_expertise")}
          hasFeedback
        >
          <Input placeholder="e.g. Molecular Biology" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="major_focus"
              label={
                <span style={{ fontWeight: 500 }}>
                  Major Focus (Type and press Enter)
                </span>
              }
              rules={zodRule("major_focus")}
              hasFeedback
            >
              <Select
                mode="tags"
                placeholder="e.g. Oncology, Neurodegeneration"
                tokenSeparators={[","]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="specific_research_areas"
              label={
                <span style={{ fontWeight: 500 }}>Specific Research Areas</span>
              }
              rules={zodRule("specific_research_areas")}
              hasFeedback
            >
              <Select
                mode="tags"
                placeholder="e.g. CRISPR, Gene Editing"
                tokenSeparators={[","]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="organ_sites"
              label={<span style={{ fontWeight: 500 }}>Organ Sites</span>}
              rules={zodRule("organ_sites")}
              hasFeedback
            >
              <Select
                mode="tags"
                placeholder="e.g. Brain, Liver"
                tokenSeparators={[","]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="additional_research_areas"
              label={
                <span style={{ fontWeight: 500 }}>
                  Additional Research Areas (Optional)
                </span>
              }
              rules={zodRule("additional_research_areas")}
              hasFeedback
            >
              <Select
                mode="tags"
                placeholder="Any secondary areas..."
                tokenSeparators={[","]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="brief_description"
          label={<span style={{ fontWeight: 500 }}>Brief Description</span>}
          rules={zodRule("brief_description")}
          hasFeedback
        >
          <TextArea
            rows={4}
            placeholder="Summarize your scientific interests and overall goals..."
          />
        </Form.Item>

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
              Save Scientific Interests
            </Button>
            {mode === "profile" && scientificInt && (
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

export default ScientificInterestSection;
