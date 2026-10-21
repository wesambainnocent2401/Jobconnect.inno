/**
 * JobConnect Kenya - Core Type Definitions
 */

export type UserRole = 'jobseeker' | 'employer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export type EducationLevel =
  | 'Any'
  | 'Primary School'
  | 'Secondary School'
  | 'Certificate'
  | 'Diploma'
  | 'Degree'
  | 'Masters'
  | 'PhD';

export interface Profile {
  id: string;
  user_id: string;
  location: string;
  education: EducationLevel;
  field_of_study: string;
  skills: string[]; // e.g. ["wiring", "repair", "typescript"]
  experience_years: number;
  experience_details: string;
  portfolio_url?: string;
  referee_name?: string;
  referee_phone?: string;
  referee_relationship?: string;
  updated_at: string;
}

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type JobStatus = 'open' | 'closed';

export interface Job {
  id: string;
  employer_id: string;
  company_name: string;
  company_email: string;
  company_website?: string;
  company_location: string;
  company_description?: string;
  company_logo_url?: string;
  title: string;
  location: string; // Kenyan county/town
  employment_type: EmploymentType;
  salary?: string; // in KSh, e.g. "KSh 45,000 - 65,000"
  positions: number; // whole number >= 1
  deadline?: string; // YYYY-MM-DD
  min_education: EducationLevel;
  min_experience_years: number;
  required_skills: string[]; // parsed from comma-separated
  certifications?: string;
  description: string;
  responsibilities?: string;
  benefits?: string;
  status: JobStatus;
  featured_until?: string; // ISO string if featured
  created_at: string;
  applicant_count?: number;
}

export type ApplicationStatus = 'pending' | 'shortlisted' | 'selected' | 'not_selected';

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  full_name: string;
  email: string;
  phone: string;
  education: EducationLevel;
  experience_years: number;
  skills: string[];
  portfolio_url?: string;
  cover_message: string;
  photo_url: string; // Base64 data URI of 350x450 passport JPEG
  status: ApplicationStatus;
  match_score: number; // 0 to 100
  score_breakdown?: {
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
  };
  rank?: number;
  total_applicants?: number;
  created_at: string;
}

export type PaymentStatus = 'waiting_approval' | 'approved' | 'rejected';

export interface Payment {
  id: string;
  job_id: string;
  job_title: string;
  employer_id: string;
  employer_name: string;
  duration_days: number; // 7 or 30
  amount: number; // in KSh (e.g. 300 or 1000)
  mpesa_code: string; // e.g. "QKJ49X82ZZ"
  phone_number: string;
  payment_method: 'till_manual' | 'daraja_stk';
  status: PaymentStatus;
  created_at: string;
  approved_at?: string;
}

export interface PlatformSettings {
  featuredPrice7Days: number;
  featuredPrice30Days: number;
  mpesaTillNumber: string;
  mpesaPaybillNumber: string;
  mpesaAccountNumber: string;
  supportEmail: string;
  supportPhone: string;
  emailNotificationsEnabled: boolean;
  darajaStkEnabled: boolean;
  adminEmail: string;
}

export interface AcceptanceApplicant {
  name: string;
  education: EducationLevel;
  experience_years: number;
  skills: string[];
}

export type InterviewFormat = 'in_person' | 'video' | 'phone';
export type InterviewStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

export interface Interview {
  id: string;
  conversation_id: string;
  job_id: string;
  job_title: string;
  employer_id: string;
  employer_name: string;
  applicant_id: string;
  applicant_name: string;
  applicant_phone: string;
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:MM (Nairobi time)
  format: InterviewFormat;
  location_or_link: string; // e.g. "Westlands Office, 4th Floor" or "Google Meet: https://meet.google.com/..."
  notes?: string;
  status: InterviewStatus;
  created_at: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  text: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  job_id: string;
  job_title: string;
  employer_id: string;
  employer_name: string;
  applicant_id: string;
  applicant_name: string;
  applicant_photo?: string;
  last_message: string;
  last_message_at: string;
  interview?: Interview;
  created_at: string;
}

export type NotificationType = 'job_match' | 'status_update' | 'interview_invite' | 'new_message';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link_view: string;
  link_param?: string;
  is_read: boolean;
  created_at: string;
}
