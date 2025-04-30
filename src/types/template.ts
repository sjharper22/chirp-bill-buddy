
export type TemplateCategory = "cover_letter" | "appeal_letter" | "general";

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
