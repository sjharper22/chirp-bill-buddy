
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
  
  // Cover letter HTML (if provided)
  const coverLetterHTML = coverLetterContent && coverLetterContent.trim() !== '' ? `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cover Letter - ${superbill.patientName}</title>
      <style>
        ${generatePrintableCSS()}
      </style>
    </head>
    <body class="pdf-optimized">
      <div class="container">
        ${coverLetterContent}
      </div>
    </body>
    </html>
  ` : '';
  
  // Superbill HTML
  const superbillHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Superbill - ${superbill.patientName}</title>
      <style>
        ${generatePrintableCSS()}
      </style>
    </head>
    <body class="pdf-optimized">
      <div class="container">
        ${generateSuperbillHeader(superbill)}
        
        <div class="info-section">
          ${generatePatientInfoSection(superbill, visitDates)}
          ${generateProviderInfoSection(superbill)}
        </div>
        
        <div class="services-section">
          <div class="services-title">Services</div>
          ${generateServicesTable(superbill)}
        </div>
        
        ${generateNotesSection(superbill)}
        
        ${generateFooter()}
      </div>
    </body>
    </html>
  `;
  
  return { coverLetterHTML, superbillHTML };
}

// Keep the original function for backward compatibility
export function buildDocumentStructure(superbill: Superbill, coverLetterContent?: string): string {
  const { coverLetterHTML, superbillHTML } = buildSeparateDocuments(superbill, coverLetterContent);
  return coverLetterHTML + superbillHTML;
}
