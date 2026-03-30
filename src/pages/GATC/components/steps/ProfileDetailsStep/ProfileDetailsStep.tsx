import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Form, type FormInstance } from "antd";

import { type RegistrationFormValues } from "../../Registration.types";
import { ContactDetailsSection } from "./ContactDetailsSection";
import { PersonalDetailsSection } from "./PersonalDetailsSection";
import { ProfessionalDetailsSection } from "./ProfessionalDetailsSection";
import { ScientificInterestsSection } from "./ScientificInterestsSection";
import type { GlobalToken } from "antd/es/theme/interface";

interface ProfileDetailsStepProps {
  form: FormInstance<RegistrationFormValues>;
  token: GlobalToken;
  isSaving: boolean;
  onSave: () => void;
}

export const ProfileDetailsStep = ({
  form,
  token,
  isSaving,
  onSave,
}: ProfileDetailsStepProps) => {
  return (
    <Form form={form} layout="vertical" requiredMark="optional" size="large">
      <PersonalDetailsSection token={token} />
      <ProfessionalDetailsSection token={token} />
      <ScientificInterestsSection token={token} />
      <ContactDetailsSection token={token} />

      {/* ── Save button ─────────────────── */}
      <div style={{ textAlign: "right", marginTop: 24 }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          icon={<ArrowRightOutlined />}
          loading={isSaving}
          onClick={onSave}
          style={{ paddingInline: 40, height: 48, fontWeight: 600 }}
        >
          Save & Continue
        </Button>
      </div>
    </Form>
  );
};
