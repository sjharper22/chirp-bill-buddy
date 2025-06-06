
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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cover Letter - ${superbill.patientName}</title>
      <style>
        ${generatePrintableCSS()}
      </style>
    </head>
    <body>
      <div class="professional-document cover-letter">
        ${coverLetterContent}
      </div>
    </body>
    </html>
  ` : '';
  
  // Superbill HTML with professional layout
  const superbillHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Superbill - ${superbill.patientName}</title>
      <style>
        ${generatePrintableCSS()}
      </style>
    </head>
    <body>
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
