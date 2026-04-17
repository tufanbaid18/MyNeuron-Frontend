import { z } from "zod";

export const userPersonalDetailsSchema = z.object({
  biosketch: z.string().min(1, "Biosketch is required"),
  research_links: z.string().min(1, "Research links are required"),
  x_handle: z.string().min(1, "X Handle is required"),
  linkedin: z.string().min(1, "LinkedIn profile is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  gender: z.string().min(1, "Gender is required"),
  dob: z.string().min(1, "Date of birth is required").nullable(),
  articles_journals: z
    .string()
    .min(1, "Articles/Journals information is required"),
  book_chapters: z.string().min(1, "Book chapters information is required"),
});

export type UserPersonalDetailsForm = z.infer<typeof userPersonalDetailsSchema>;

export const userPastProfessionalDetailsSchema = z.object({
  id: z.number().optional(),
  role: z.string().min(1, "Role is required"),
  organization: z.string().min(1, "Organization is required"),
  department: z.string().min(1, "Department is required"),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900),
  end_month: z.number().min(1).max(12),
  end_year: z.number().min(1900),
  description: z.string().min(1, "Description is required"),
});

export type UserPastProfessionalDetailsForm = z.infer<
  typeof userPastProfessionalDetailsSchema
>;

export const userProfessionalDetailsSchema = z.object({
  current_role: z.string().min(1, "Current role is required"),
  current_organization: z.string().min(1, "Current organization is required"),
  current_department: z.string().min(1, "Current department is required"),
  current_start_month: z.number().min(1, "Start month is required").max(12),
  current_start_year: z.number().min(1900, "Start year is required"),
  current_description: z.string().min(1, "Description is required"),
  work_email: z
    .string()
    .email("Invalid email address")
    .min(1, "Work email is required"),
  contact_number: z.string().min(1, "Contact number is required"),
  emergency_contact_number: z.string().min(1, "Emergency contact is required"),
  website: z.string().optional().or(z.literal("")),
  lab: z.string().min(1, "Lab information is required"),
  work_address: z.string().min(1, "Work address is required"),
  skill_set: z.string().min(1, "Skill set is required"),
  languages_spoken: z.string().min(1, "Languages spoken is required"),
  certifications: z.string().min(1, "Certifications are required"),
  past_experiences: z.array(userPastProfessionalDetailsSchema).optional(),
});

export type UserProfessionalDetailsForm = z.infer<
  typeof userProfessionalDetailsSchema
>;

export const userEducationSchema = z.object({
  id: z.number().optional(),
  degree: z.string().min(1, "Degree is required"),
  course_name: z.string().min(1, "Course name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  university: z.string().min(1, "University is required"),
  institute: z.string().min(1, "Institute is required"),
  place: z.string().min(1, "Place is required"),
  country: z.string().min(1, "Country is required"),
  start_year: z.number().min(1900),
  end_year: z.number().min(1900),
  is_current: z.boolean(),
  topic: z.string().min(1, "Topic is required"),
  lab_or_department: z.string().min(1, "Lab/Department is required"),
  research_interests: z.string().min(1, "Research interests are required"),
  research_summary: z.string().min(1, "Research summary is required"),
  order: z.number().optional(),
});

export type UserEducationForm = z.infer<typeof userEducationSchema>;

export const userScientificInterestSchema = z.object({
  id: z.number().optional(),
  research_area_of_expertise: z
    .string()
    .min(1, "Research area of expertise is required"),
  major_focus: z
    .array(z.string())
    .min(1, "At least one major focus is required"),
  specific_research_areas: z
    .array(z.string())
    .min(1, "At least one specific research area is required"),
  organ_sites: z
    .array(z.string())
    .min(1, "At least one organ site is required"),
  additional_research_areas: z.array(z.string()).optional(),
  brief_description: z.string().min(1, "Brief description is required"),
});

export type UserScientificInterestForm = z.infer<
  typeof userScientificInterestSchema
>;
