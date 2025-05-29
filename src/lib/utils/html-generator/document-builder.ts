
import { Superbill } from "@/types/superbill";
import { generatePrintableCSS } from "./css-generator";
import { 
  generatePatientInfoSection, 
  generateProviderInfoSection, 
  generateServicesTable, 
  generateNotesSection, 
  generateFooter 
} from "./html-structure";

export function buildDocumentStructure(superbill: Superbill, coverLetterContent?: string): string {
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  
  let coverLetterHTML = '';
  if (coverLetterContent && coverLetterContent.trim() !== '') {
    coverLetterHTML = `
      <div class="cover-letter">
        ${coverLetterContent}
      </div>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Superbill - ${superbill.patientName}</title>
      <style>
        ${generatePrintableCSS()}
      </style>
    </head>
    <body>
      <div class="container">
        ${coverLetterHTML}
        
        <div class="header">
          <h1>SUPERBILL</h1>
        </div>
        
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
}
