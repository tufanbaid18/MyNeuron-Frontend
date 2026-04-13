import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Space,
  Typography,
  Skeleton,
  Card,
  InputNumber,
  Modal,
  Popconfirm,
  Switch,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  GlobalOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  useEducationList,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
} from "../../../hooks/user/useUserEducationDetails";
import { userEducationSchema } from "../../../validations/user.schemas";
import type { UserEducationForm } from "../../../validations/user.schemas";
import { createZodValidator } from "../../../validations/zodValidator";

const { TextArea } = Input;
const { Text, Title } = Typography;

type EducationSectionProps = {
  mode?: "profile" | "registration";
};

const EducationSection: React.FC<EducationSectionProps> = ({
  mode = "profile",
}) => {
  const { data: educationList = [], isLoading } = useEducationList();
  const { mutateAsync: addEducation, isPending: adding } = useAddEducation();
  const { mutateAsync: updateEducation, isPending: updating } =
    useUpdateEducation();
  const { mutateAsync: deleteEducation, isPending: deleting } =
    useDeleteEducation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form] = Form.useForm<UserEducationForm>();

  const openAddModal = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      is_current: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (
    education: import("../../../types/user/user.types").UserEducation,
  ) => {
    setEditingId(education.id!);
    form.setFieldsValue({
      degree: education.degree || "",
      course_name: education.course_name || "",
      specialization: education.specialization || "",
      university: education.university || "",
      institute: education.institute || "",
      place: education.place || "",
      country: education.country || "",
      start_year: education.start_year || new Date().getFullYear(),
      end_year: education.end_year || new Date().getFullYear(),
      is_current: education.is_current,
      topic: education.topic || "",
      lab_or_department: education.lab_or_department || "",
      research_interests: education.research_interests || "",
      research_summary: education.research_summary || "",
      order: education.order,
      id: education.id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEducation(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFinish = async (values: UserEducationForm) => {
    try {
      if (editingId) {
        await updateEducation({ id: editingId, data: values });
      } else {
        await addEducation(values);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const zodRule = (fieldName: keyof typeof userEducationSchema.shape) => [
    {
      validator: createZodValidator(userEducationSchema, fieldName, mode),
    },
  ];

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  return (
    <div className="animate-fade-in transition-all">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Educational History
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
          shape="round"
        >
          Add Education
        </Button>
      </div>

      {educationList.length === 0 ? (
        <Card
          style={{ textAlign: "center", padding: "40px" }}
          variant="borderless"
        >
          <BookOutlined
            style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
          />
          <p>No educational history found.</p>
          <Button type="dashed" onClick={openAddModal}>
            Add First Entry
          </Button>
        </Card>
      ) : (
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          {educationList.map(
            (edu: import("../../../types/user/user.types").UserEducation) => (
              <Card
                key={edu.id}
                hoverable
                title={
                  <span style={{ fontWeight: 600 }}>
                    {edu.degree} - {edu.course_name}
                  </span>
                }
                extra={
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(edu)}
                    />
                    <Popconfirm
                      title="Delete this entry?"
                      onConfirm={() => handleDelete(edu.id)}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        loading={deleting}
                      />
                    </Popconfirm>
                  </Space>
                }
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Text type="secondary">
                      <GlobalOutlined /> {edu.university}, {edu.institute}
                    </Text>
                    <div>
                      <Text type="secondary">
                        {edu.place}, {edu.country}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} md={12} style={{ textAlign: "right" }}>
                    <Space>
                      <Tag color="blue">
                        {edu.start_year} -{" "}
                        {edu.is_current ? "Present" : edu.end_year}
                      </Tag>
                    </Space>
                  </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                  <Text strong>Specialization:</Text> {edu.specialization}{" "}
                  <br />
                  <Text strong>Lab / Department:</Text> {edu.lab_or_department}{" "}
                  <br />
                  <Text strong>Research Summary:</Text> <br />
                  <Text type="secondary">{edu.research_summary}</Text>
                </div>
              </Card>
            ),
          )}
        </Space>
      )}

      <Modal
        title={editingId ? "Edit Education Entry" : "Add Education Entry"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark="optional"
          size="middle"
          style={{ paddingTop: 16 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="degree"
                label="Degree"
                rules={zodRule("degree")}
                hasFeedback
              >
                <Input placeholder="e.g. PhD" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="course_name"
                label="Course Name"
                rules={zodRule("course_name")}
                hasFeedback
              >
                <Input placeholder="e.g. Biological Engineering" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="specialization"
                label="Specialization"
                rules={zodRule("specialization")}
                hasFeedback
              >
                <Input placeholder="e.g. Synthetic Biology" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="university"
                label="University"
                rules={zodRule("university")}
                hasFeedback
              >
                <Input placeholder="e.g. Stanford University" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="institute"
                label="Institute"
                rules={zodRule("institute")}
                hasFeedback
              >
                <Input placeholder="Institute or College Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="place"
                    label="City/Place"
                    rules={zodRule("place")}
                    hasFeedback
                  >
                    <Input placeholder="City" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={zodRule("country")}
                    hasFeedback
                  >
                    <Input placeholder="Country" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row gutter={16} align="middle">
            <Col xs={12} md={6}>
              <Form.Item
                name="start_year"
                label="Start Year"
                rules={zodRule("start_year")}
                hasFeedback
              >
                <InputNumber min={1900} max={2100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.is_current !== currentValues.is_current
                }
              >
                {({ getFieldValue }) => {
                  const isCurrent = getFieldValue("is_current");
                  return (
                    <Form.Item
                      name="end_year"
                      label="End Year"
                      rules={isCurrent ? [] : zodRule("end_year")}
                      hasFeedback
                    >
                      <InputNumber
                        min={1900}
                        max={2100}
                        style={{ width: "100%" }}
                        disabled={isCurrent}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="is_current"
                valuePropName="checked"
                style={{ paddingTop: 30 }}
              >
                <Switch
                  checkedChildren="Currently Enrolled"
                  unCheckedChildren="Graduated"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="topic"
            label="Thesis / Main Topic"
            rules={zodRule("topic")}
            hasFeedback
          >
            <Input placeholder="Dissertation topic or main area of study" />
          </Form.Item>

          <Form.Item
            name="lab_or_department"
            label="Lab / Department"
            rules={zodRule("lab_or_department")}
            hasFeedback
          >
            <Input placeholder="Associated lab or department" />
          </Form.Item>

          <Form.Item
            name="research_interests"
            label="Research Interests"
            rules={zodRule("research_interests")}
            hasFeedback
          >
            <TextArea
              rows={2}
              placeholder="Briefly list research interests during this period"
            />
          </Form.Item>

          <Form.Item
            name="research_summary"
            label="Research Summary"
            rules={zodRule("research_summary")}
            hasFeedback
          >
            <TextArea
              rows={4}
              placeholder="Summarize your research accomplishments..."
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", margin: 0 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={adding || updating}
              >
                Save Education
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EducationSection;
