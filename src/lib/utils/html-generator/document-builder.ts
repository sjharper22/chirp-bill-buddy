import { Superbill } from "@/types/superbill";
import { generatePrintableCSS } from "./css-generator";
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
  const styles = generatePrintableCSS();
  
  // Cover letter HTML (if provided) - simplified with inline styles
  const coverLetterHTML = coverLetterContent && coverLetterContent.trim() !== '' ? `
    <div style="max-width: 8.5in; margin: 0 auto; background: #ffffff; padding: 30px; font-family: 'Open Sans', Arial, sans-serif; color: #333; line-height: 1.6;">
      ${coverLetterContent}
    </div>
  ` : '';
  
  // Superbill HTML with inline styles for better rendering
  const superbillHTML = `
    <div style="max-width: 8.5in; margin: 0 auto; background: #ffffff; font-family: 'Open Sans', Arial, sans-serif; color: #333;">
      <style>${styles}</style>
      <div class="professional-document">
        ${generateSuperbillHeader(superbill)}
        
        <div class="document-body">
          <div class="info-grid">
            ${generatePatientInfoSection(superbill, visitDates)}
            ${generateProviderInfoSection(superbill)}
          </div>
          
          ${generateServicesTable(superbill)}
          
          ${generateNotesSection(superbill)}
        </div>
        
        ${generateFooter()}
      </div>
    </div>
  `;
  
  return { coverLetterHTML, superbillHTML };
}

// Keep the original function for backward compatibility
export function buildDocumentStructure(superbill: Superbill, coverLetterContent?: string): string {
  const { coverLetterHTML, superbillHTML } = buildSeparateDocuments(superbill, coverLetterContent);
  return coverLetterHTML + superbillHTML;
}
