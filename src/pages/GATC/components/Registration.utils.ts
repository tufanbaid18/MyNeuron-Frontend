import type { RegistrationFormValues } from "./Registration.types";

// ─── Option mappers ──────────────────────────────────────────────
export const mapOptions = (opts: string[]) =>
  opts.map((o) => ({ label: o, value: o }));

/**
 * Returns true if every required field has a non-empty value.
 * "Non-empty" means: non-empty string, or non-empty array.
 */
export const allRequiredFieldsFilled = (
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
