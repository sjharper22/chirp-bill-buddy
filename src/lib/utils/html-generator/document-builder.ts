
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
  
  // Cover letter HTML (if provided) - clean HTML with proper styling
  const coverLetterHTML = coverLetterContent && coverLetterContent.trim() !== '' ? `
    <div style="width: 210mm; max-width: 100%; margin: 0 auto; background: #ffffff; padding: 25px; font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; box-sizing: border-box;">
      ${coverLetterContent}
    </div>
  ` : '';
  
  // Superbill HTML with professional styling
  const superbillHTML = `
    <div style="width: 210mm; max-width: 100%; margin: 0 auto; background: #ffffff; font-family: 'Arial', sans-serif; color: #333; padding: 20px; box-sizing: border-box;">
      ${generateSuperbillHeader(superbill)}
      
      <div style="padding: 25px 0;">
        <div style="display: flex; justify-content: space-between; gap: 30px; margin-bottom: 30px;">
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
