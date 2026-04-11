export type UserProfile = {
  id: number;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  title: string | null;
  profile_title: string | null;
  profile_image: string | null;
  personal_detail: UserPersonalDetails | null;
  professional_detail: UserProfessionalDetails | null;
  education: UserEducation[];
  scientific_interest: UserScientificInterest | null;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  follow_request_status: "none";
  is_verified: boolean;
  registered_events: UserRegisteredEvents[];
};

export type UserRegisteredEvents = {
  event_id: number;
  event_name: string;
  category: string;
  pricing: number;
  payment_status: string;
  manual_payment_status: string | null;
};

export enum RegisteredEventPaymentStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAID = "PAID",
  MANUAL_PENDING = "MANUAL_PENDING",
  MANUAL_VERIFIED = "MANUAL_VERIFIED",
  FAILED = "FAILED",
}

export type UserEducation = {
  id: number;
  degree: string | null;
  course_name: string | null;
  specialization: string | null;
  university: string | null;
  institute: string | null;
  place: string | null;
  country: string | null;
  start_year: number | null;
  end_year: number | null;
  is_current: boolean;
  topic: string | null;
  lab_or_department: string | null;
  research_interests: string | null;
  research_summary: string | null;
  order: number;
  created_at: string;
};

export type UserPersonalDetails = {
  id: number;
  biosketch: string | null;
  research_links: string | null;
  x_handle: string | null;
  linkedin: string | null;
  city: string | null;
  country: string | null;
  gender: string | null;
  dob: string | null;
  articles_journals: string | null;
  book_chapters: string | null;
} | null;

export type UserProfessionalDetails = {
  current_role: string | null;
  current_organization: string | null;
  current_department: string | null;
  current_start_month: number | null;
  current_start_year: number | null;
  current_description: string | null;
  work_email: string | null;
  contact_number: string | null;
  emergency_contact_number: string | null;
  website: string | null;
  lab: string | null;
  work_address: string | null;
  skill_set: string | null;
  languages_spoken: string | null;
  certifications: string | null;
  past_experiences: UserPastProfessionalDetails[] | null;
};

export type UserPastProfessionalDetails = {
  id: number;
  role: string | null;
  organization: string | null;
  department: string | null;
  start_month: number | null;
  start_year: number | null;
  end_month: number | null;
  end_year: number | null;
  description: string | null;
};

export type UserEducationDetails = {
  id: number;
  degree: string | null;
  course_name: string | null;
  specialization: string | null;
  university: string | null;
  institute: string | null;
  place: string | null;
  country: string | null;
  start_year: number | null;
  end_year: number | null;
  is_current: boolean;
  topic: string | null;
  lab_or_department: string | null;
  research_interests: string | null;
  research_summary: string | null;
  order: number;
  created_at: string;
}[];

export type UserScientificInterest = {
  id: number;
  research_area_of_expertise: string | null;
  major_focus: string[];
  specific_research_areas: string[];
  organ_sites: string[];
  additional_research_areas: string[];
  brief_description: string | null;
  created_at: string;
  updated_at: string;
};
