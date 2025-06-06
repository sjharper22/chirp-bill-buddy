import { Superbill } from "@/types/superbill";
import { 
  generateSuperbillHeader,
  generatePatientInfoSection, 
  generateProviderInfoSection, 
  generateServicesTable, 
  generateNotesSection, 
  generateFooter 
} from "./html-structure";

export function buildSeparateDocuments(superbill: Superbill, coverLetterContent?: string): { coverLetterHTML: string; superbillHTML: string } {
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  
  // Cover letter HTML (if provided) - clean HTML without CSS
  const coverLetterHTML = coverLetterContent && coverLetterContent.trim() !== '' ? `
    <div style="max-width: 8.5in; margin: 0 auto; background: #ffffff; padding: 30px; font-family: 'Open Sans', Arial, sans-serif; color: #333; line-height: 1.6;">
      ${coverLetterContent}
    </div>
  ` : '';
  
  // Superbill HTML without any CSS style tags
  const superbillHTML = `
    <div style="max-width: 8.5in; margin: 0 auto; background: #ffffff; font-family: 'Open Sans', Arial, sans-serif; color: #333; padding: 20px;">
      ${generateSuperbillHeader(superbill)}
      
      <div style="padding: 30px; background: #ffffff;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; padding: 20px; background: #f8fffe; border: 1px solid #e5f3f0; border-radius: 8px;">
          ${generatePatientInfoSection(superbill, visitDates)}
          ${generateProviderInfoSection(superbill)}
        </div>
        
        ${generateServicesTable(superbill)}
        
        ${generateNotesSection(superbill)}
      </div>
      
      ${generateFooter()}
    </div>
  `;
  
  return { coverLetterHTML, superbillHTML };
}

// Keep the original function for backward compatibility
export function buildDocumentStructure(superbill: Superbill, coverLetterContent?: string): string {
  const { coverLetterHTML, superbillHTML } = buildSeparateDocuments(superbill, coverLetterContent);
  return coverLetterHTML + superbillHTML;
}
