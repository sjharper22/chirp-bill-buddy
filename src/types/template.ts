
export type TemplateCategory = 
  | "cover_letter" 
  | "reimbursement_instructions" 
  | "referral_letter" 
  | "thank_you_note" 
  | "reminder_message"
  | "appeal_letter" 
  | "general";

export interface LetterTemplate {
  id: string;
  title: string;
  content: { text: string };
  category: TemplateCategory;
  created_by: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateWithProcessedContent extends LetterTemplate {
  processedContent?: string;
}

export interface TemplateVariable {
  label: string;
  variable: string;
  description?: string;
  group?: string;
}

export interface TemplateBundle {
  id: string;
  name: string;
  templateIds: string[];
  createdAt: string;
}

export type ExportFormat = 'pdf' | 'docx' | 'html';
