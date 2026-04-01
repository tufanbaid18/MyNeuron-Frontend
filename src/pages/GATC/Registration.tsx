import {
  CheckCircleOutlined,
  CreditCardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Form, Grid, Skeleton, Steps, message, theme } from "antd";
import { useEffect, useState } from "react";

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
import type { EventPricing } from "../../types/gatc/gatc.types";

import { type RegistrationFormValues } from "./components/Registration.types";
import { allRequiredFieldsFilled } from "./components/Registration.utils";
import { RegistrationHeroBanner } from "./components/RegistrationHeroBanner";
import { CategoryStep } from "./components/steps/CategoryStep";
import { PaymentStep } from "./components/steps/PaymentStep";
import { ProfileDetailsStep } from "./components/steps/ProfileDetailsStep/ProfileDetailsStep";

const { useBreakpoint } = Grid;

// ═════════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════════
export default function GatcRegistration() {
  const screens = useBreakpoint();
  const { token } = theme.useToken();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<RegistrationFormValues>();
  const [isSaving, setIsSaving] = useState(false);

  // ── Payment flow state (shared between CategoryStep & PaymentStep) ──
  const [selectedPricing, setSelectedPricing] = useState<EventPricing | null>(
    null,
  );
  const [registrationId, setRegistrationId] = useState<number | null>(null);

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

      // Sequential saves (matches old registration flow)
      await updateUser.mutateAsync({
        title: values.title,
        first_name: values.first_name,
        middle_name: values.middle_name || "",
        last_name: values.last_name,
      });
      await updatePersonal.mutateAsync({
        gender: values.gender,
        dob: values.dob || "",
        city: values.city,
        country: values.country,
      });
      await updateProfessional.mutateAsync({
        current_organization: values.current_organization,
        current_role: values.current_role,
        current_department: values.current_department,
        contact_number: values.contact_number,
        website: values.website || "",
        work_address: values.work_address,
      });
      await updateScientific.mutateAsync({
        research_area_of_expertise: values.research_area_of_expertise,
        major_focus: values.major_focus,
        specific_research_areas: values.specific_research_areas,
        organ_sites: values.organ_sites,
        additional_research_areas: values.additional_research_areas || [],
      });

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
      <RegistrationHeroBanner token={token} />

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

          {currentStep === 0 && (
            <ProfileDetailsStep
              form={form}
              token={token}
              isSaving={isSaving}
              onSave={handleSaveAndContinue}
            />
          )}

          {currentStep === 1 && (
            <CategoryStep
              token={token}
              selectedPricing={selectedPricing}
              onPricingSelect={setSelectedPricing}
              onBack={() => setCurrentStep(0)}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && selectedPricing && (
            <PaymentStep
              token={token}
              selectedPricing={selectedPricing}
              registrationId={registrationId}
              setRegistrationId={setRegistrationId}
              userData={userData}
              onBack={() => setCurrentStep(1)}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
