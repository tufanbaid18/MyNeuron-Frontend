// ─── Types ───────────────────────────────────────────────────────
export type BasicFields = {
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
};

export type PersonalFields = {
  gender: string;
  dob: string;
  city: string;
  country: string;
};

export type ProfessionalFields = {
  current_organization: string;
  current_role: string;
  current_department: string;
  contact_number: string;
  website: string;
  work_address: string;
};

export type ScientificFields = {
  research_area_of_expertise: string;
  major_focus: string[];
  specific_research_areas: string[];
  organ_sites: string[];
  additional_research_areas: string[];
};

export type RegistrationFormValues = BasicFields &
  PersonalFields &
  ProfessionalFields &
  ScientificFields;
