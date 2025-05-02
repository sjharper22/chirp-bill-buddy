
export interface Patient {
  id: string;
  name: string;
  dob: Date;
  phone: string | null;
  email: string | null;
  common_complaints: string[];
  default_icd_codes: string[];
  default_cpt_codes: string[];
  visit_count: number;
  total_billed: number;
  last_visit_date: Date | null;
  created_at: Date;
  updated_at: Date;
  notes?: string;
}
