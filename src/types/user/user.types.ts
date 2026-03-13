export type UserProfile = {
  id: number;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  title: string | null;
  profile_title: string | null;
  profile_image: string | null;
  personal_detail: string | null;
  professional_detail: string | null;
  education: UserEducation[];
  scientific_interest: string | null;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  follow_request_status: "none";
};

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
