import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  ExperimentOutlined,
  IdcardOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Grid,
  Input,
  message,
  Result,
  Row,
  Select,
  Skeleton,
  Space,
  Steps,
  theme,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IoBriefcaseOutline } from "react-icons/io5";

import {
  useUpdateUserProfile,
  useUserProfile,
} from "../../hooks/auth/useUserProfile";
import {
  usePersonalDetail,
  useUpdatePersonalDetail,
} from "../../hooks/user/useUserPersonalDetails";
import {
  useProfessionalDetail,
  useUpdateProfessionalDetail,
} from "../../hooks/user/useUserProfessionalDetails";
import {
  useScientificInterest,
  useUpdateScientificInterest,
} from "../../hooks/user/useUserScientificInterests";

import {
  ADDITIONAL_RESEARCH_AREA_OPTIONS,
  MAJOR_FOCUS_OPTIONS,
  ORGAN_SITE_OPTIONS,
  RESEARCH_AREA_OPTIONS,
  SPECIFIC_RESEARCH_AREA_OPTIONS,
} from "../../constants/gatcRegistration.data";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// ─── Types ───────────────────────────────────────────────────────
type BasicFields = {
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
};

type PersonalFields = {
  gender: string;
  dob: string;
  city: string;
  country: string;
};

type ProfessionalFields = {
  current_organization: string;
  current_role: string;
  current_department: string;
  contact_number: string;
  website: string;
  work_address: string;
};

type ScientificFields = {
  research_area_of_expertise: string;
  major_focus: string[];
  specific_research_areas: string[];
  organ_sites: string[];
  additional_research_areas: string[];
};

type RegistrationFormValues = BasicFields &
  PersonalFields &
  ProfessionalFields &
  ScientificFields;

// ─── Option mappers ──────────────────────────────────────────────
const mapOptions = (opts: string[]) =>
  opts.map((o) => ({ label: o, value: o }));

/**
 * Returns true if every required field has a non-empty value.
 * "Non-empty" means: non-empty string, or non-empty array.
 */
const allRequiredFieldsFilled = (
  values: Partial<RegistrationFormValues>,
): boolean => {
  const allKeys: (keyof RegistrationFormValues)[] = [
    "title",
    "first_name",
    "last_name",
    "gender",
    "dob",
    "city",
    "country",
    "current_organization",
    "current_role",
    "current_department",
    "contact_number",
    "work_address",
    "research_area_of_expertise",
    "major_focus",
    "specific_research_areas",
    "organ_sites",
  ];

  return allKeys.every((key) => {
    const val = values[key];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val)) return val.length > 0;
    return String(val).trim().length > 0;
  });
};

// ═════════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════════
export default function GatcRegistration() {
  const screens = useBreakpoint();
  const { token } = theme.useToken();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<RegistrationFormValues>();
  const [isSaving, setIsSaving] = useState(false);

  // ── Data hooks ──────────────────────────────────────────────
  const { data: userData, isLoading: loadingUser } = useUserProfile();
  const { data: personalData, isLoading: loadingPersonal } =
    usePersonalDetail();
  const { data: professionalData, isLoading: loadingProfessional } =
    useProfessionalDetail();
  const { data: scientificData, isLoading: loadingScientific } =
    useScientificInterest();

  // ── Mutation hooks ──────────────────────────────────────────
  const updateUser = useUpdateUserProfile();
  const updatePersonal = useUpdatePersonalDetail();
  const updateProfessional = useUpdateProfessionalDetail();
  const updateScientific = useUpdateScientificInterest();

  const isLoading =
    loadingUser || loadingPersonal || loadingProfessional || loadingScientific;

  // ── Populate form once data arrives ─────────────────────────
  useEffect(() => {
    if (isLoading) return;

    const initialValues: Partial<RegistrationFormValues> = {
      title: userData?.title || "",
      first_name: userData?.first_name || "",
      middle_name: userData?.middle_name || "",
      last_name: userData?.last_name || "",
      gender: personalData?.gender || "",
      dob: personalData?.dob || "",
      city: personalData?.city || "",
      country: personalData?.country || "",
      current_organization: professionalData?.current_organization || "",
      current_role: professionalData?.current_role || "",
      current_department: professionalData?.current_department || "",
      contact_number: professionalData?.contact_number || "",
      website: professionalData?.website || "",
      work_address: professionalData?.work_address || "",
      research_area_of_expertise:
        scientificData?.research_area_of_expertise || "",
      major_focus: scientificData?.major_focus || [],
      specific_research_areas: scientificData?.specific_research_areas || [],
      organ_sites: scientificData?.organ_sites || [],
      additional_research_areas:
        scientificData?.additional_research_areas || [],
    };

    form.setFieldsValue(initialValues);

    // Auto-advance if all required fields are already filled
    if (allRequiredFieldsFilled(initialValues as RegistrationFormValues)) {
      setCurrentStep(1);
    }
  }, [
    isLoading,
    userData,
    personalData,
    professionalData,
    scientificData,
    form,
  ]);

  // ── Save & Continue handler ─────────────────────────────────
  const handleSaveAndContinue = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);

      // Build payloads matching the old project's API structure
      const basicPayload: BasicFields = {
        title: values.title,
        first_name: values.first_name,
        middle_name: values.middle_name || "",
        last_name: values.last_name,
      };

      const personalPayload: PersonalFields = {
        gender: values.gender,
        dob: values.dob || "",
        city: values.city,
        country: values.country,
      };

      const professionalPayload: ProfessionalFields = {
        current_organization: values.current_organization,
        current_role: values.current_role,
        current_department: values.current_department,
        contact_number: values.contact_number,
        website: values.website || "",
        work_address: values.work_address,
      };

      const scientificPayload: ScientificFields = {
        research_area_of_expertise: values.research_area_of_expertise,
        major_focus: values.major_focus,
        specific_research_areas: values.specific_research_areas,
        organ_sites: values.organ_sites,
        additional_research_areas: values.additional_research_areas || [],
      };

      // Sequential saves (matches old registration flow)
      await updateUser.mutateAsync(basicPayload);
      await updatePersonal.mutateAsync(personalPayload);
      await updateProfessional.mutateAsync(professionalPayload);
      await updateScientific.mutateAsync(scientificPayload);

      message.success("Profile details saved successfully!");
      setCurrentStep(1);
    } catch (error: unknown) {
      // Ant Design validateFields throws when fields fail — that's UI-level
      if (error && typeof error === "object" && "errorFields" in error) {
        message.error("Please complete all required fields.");
        return;
      }
      console.error("Save failed:", error);
      message.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Steps config ───────────────────────────────────────────
  const steps = [
    { title: "Details", icon: <UserOutlined /> },
    { title: "Category", icon: <CreditCardOutlined /> },
    { title: "Payment", icon: <CheckCircleOutlined /> },
  ];

  // ── Loading state ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <div
      style={{
        background: token.colorBgLayout,
        minHeight: "100vh",
      }}
    >
      {/* ── Hero Banner ─────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #7c3aed 100%)`,
          padding: screens.md ? "48px 32px 64px" : "32px 16px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            filter: "blur(30px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "10%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            filter: "blur(20px)",
          }}
        />

        <Title
          level={screens.md ? 2 : 3}
          style={{ color: "#fff", margin: 0, fontWeight: 700 }}
        >
          GATC 2026 Registration
        </Title>
        <Paragraph
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 16,
            marginBottom: 0,
            marginTop: 8,
          }}
        >
          International Genomics Advancements Through Convergence
        </Paragraph>
      </div>

      {/* ── Main Card ──────────────────────────────────── */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: screens.md ? "0 32px" : "0 16px",
          marginTop: "-32px",
          position: "relative",
          zIndex: 10,
          paddingBottom: 60,
        }}
      >
        <Card
          variant="outlined"
          style={{
            borderRadius: 20,
            boxShadow: token.boxShadowSecondary,
          }}
          styles={{ body: { padding: screens.md ? "40px 48px" : "24px 20px" } }}
        >
          {/* Steps indicator */}
          <Steps
            current={currentStep}
            items={steps}
            style={{ marginBottom: 40 }}
            size={screens.md ? "medium" : "small"}
          />

          {/* ═══════════ STEP 1 — Profile Details ═══════════ */}
          {currentStep === 0 && (
            <Form
              form={form}
              layout="vertical"
              requiredMark="optional"
              size="large"
            >
              {/* ── Personal Details ─────────────── */}
              <Divider titlePlacement="left">
                <Space>
                  <IdcardOutlined style={{ color: token.colorPrimary }} />
                  <Text
                    strong
                    style={{ fontSize: 16, color: token.colorPrimary }}
                  >
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
                    rules={[
                      { required: true, message: "First name is required" },
                    ]}
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
                    rules={[
                      { required: true, message: "Last name is required" },
                    ]}
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
                    label={
                      <span style={{ fontWeight: 500 }}>Date of Birth</span>
                    }
                    rules={[
                      { required: true, message: "Date of birth is required" },
                    ]}
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

              {/* ── Professional Details ─────────── */}
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
                  <Text
                    strong
                    style={{ fontSize: 16, color: token.colorPrimary }}
                  >
                    Professional Details
                  </Text>
                </Space>
              </Divider>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="current_organization"
                    label={
                      <span style={{ fontWeight: 500 }}>Organization</span>
                    }
                    rules={[
                      { required: true, message: "Organization is required" },
                    ]}
                  >
                    <Input placeholder="e.g., Harvard University" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="current_role"
                    label={<span style={{ fontWeight: 500 }}>Role</span>}
                    rules={[{ required: true, message: "Role is required" }]}
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
                    ]}
                  >
                    <Input placeholder="e.g., Neuroscience" />
                  </Form.Item>
                </Col>
              </Row>

              {/* ── Scientific Interests ────────── */}
              <Divider titlePlacement="left" style={{ marginTop: 32 }}>
                <Space>
                  <ExperimentOutlined style={{ color: token.colorPrimary }} />
                  <Text
                    strong
                    style={{ fontSize: 16, color: token.colorPrimary }}
                  >
                    Scientific Interests
                  </Text>
                </Space>
              </Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="research_area_of_expertise"
                    label={
                      <span style={{ fontWeight: 500 }}>Research Area</span>
                    }
                    rules={[
                      { required: true, message: "Research area is required" },
                    ]}
                  >
                    <Select
                      placeholder="Select research area"
                      options={mapOptions(RESEARCH_AREA_OPTIONS)}
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="major_focus"
                    label={<span style={{ fontWeight: 500 }}>Major Focus</span>}
                    rules={[
                      {
                        required: true,
                        type: "array",
                        min: 1,
                        message: "At least one major focus is required",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select major focus areas"
                      options={mapOptions(MAJOR_FOCUS_OPTIONS)}
                      showSearch
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    name="specific_research_areas"
                    label={
                      <span style={{ fontWeight: 500 }}>
                        Specific Research Areas
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        type: "array",
                        min: 1,
                        message:
                          "At least one specific research area is required",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Search and select areas"
                      options={mapOptions(SPECIFIC_RESEARCH_AREA_OPTIONS)}
                      showSearch
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="organ_sites"
                    label={<span style={{ fontWeight: 500 }}>Organ Sites</span>}
                    rules={[
                      {
                        required: true,
                        type: "array",
                        min: 1,
                        message: "At least one organ site is required",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select organ sites"
                      options={mapOptions(ORGAN_SITE_OPTIONS)}
                      showSearch
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
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select additional areas"
                      options={mapOptions(ADDITIONAL_RESEARCH_AREA_OPTIONS)}
                      showSearch
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* ── Contact Details ─────────────── */}
              <Divider titlePlacement="left" style={{ marginTop: 32 }}>
                <Space>
                  <PhoneOutlined style={{ color: token.colorPrimary }} />
                  <Text
                    strong
                    style={{ fontSize: 16, color: token.colorPrimary }}
                  >
                    Contact Details
                  </Text>
                </Space>
              </Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="contact_number"
                    label={
                      <span style={{ fontWeight: 500 }}>Contact Number</span>
                    }
                    rules={[
                      { required: true, message: "Contact number is required" },
                    ]}
                  >
                    <Input placeholder="+91 98765 43210" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="website"
                    label={
                      <span style={{ fontWeight: 500 }}>
                        Website (Optional)
                      </span>
                    }
                  >
                    <Input placeholder="https://example.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    name="work_address"
                    label={
                      <span style={{ fontWeight: 500 }}>Work Address</span>
                    }
                    rules={[
                      { required: true, message: "Work address is required" },
                    ]}
                  >
                    <Input.TextArea rows={3} placeholder="Full work address" />
                  </Form.Item>
                </Col>
              </Row>

              {/* ── Save button ─────────────────── */}
              <div style={{ textAlign: "right", marginTop: 24 }}>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  icon={<ArrowRightOutlined />}
                  loading={isSaving}
                  onClick={handleSaveAndContinue}
                  style={{ paddingInline: 40, height: 48, fontWeight: 600 }}
                >
                  Save & Continue
                </Button>
              </div>
            </Form>
          )}

          {/* ═══════════ STEP 2 — Category (Skeleton) ═══════════ */}
          {currentStep === 1 && (
            <div>
              <Result
                icon={
                  <CreditCardOutlined style={{ color: token.colorPrimary }} />
                }
                title="Select Registration Category"
                subTitle="Category selection and pricing will be implemented here."
                extra={[
                  <Button
                    key="back"
                    shape="round"
                    onClick={() => setCurrentStep(0)}
                  >
                    Back to Details
                  </Button>,
                  <Button
                    key="next"
                    type="primary"
                    shape="round"
                    onClick={() => setCurrentStep(2)}
                    disabled
                  >
                    Proceed to Payment
                  </Button>,
                ]}
              />

              {/* TODO: Implement category selection cards
                 - Country-based pricing (India vs International)
                 - 3 categories: Students, Faculty, Industry
                 - Each card shows price label
                 - On select → setSelectedPlan({ category, price })
                 - On continue → handleProceedToPayment()
              */}
            </div>
          )}

          {/* ═══════════ STEP 3 — Payment (Skeleton) ═══════════ */}
          {currentStep === 2 && (
            <div>
              <Result
                icon={
                  <CheckCircleOutlined style={{ color: token.colorPrimary }} />
                }
                title="Payment"
                subTitle="QR code generation and payment instructions will be implemented here."
                extra={[
                  <Button
                    key="back"
                    shape="round"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back to Category
                  </Button>,
                  <Button key="submit" type="primary" shape="round" disabled>
                    Submit Registration
                  </Button>,
                ]}
              />

              {/* TODO: Implement payment step
                 - Call getQRcode(upiUrl) to generate QR
                 - Display QR image
                 - Show payment amount
                 - Show email instructions (info@bencoslife.com)
                 - Submit registration button
              */}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
