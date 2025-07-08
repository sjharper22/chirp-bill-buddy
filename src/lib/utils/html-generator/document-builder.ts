import { Superbill } from "@/types/superbill";
import { generatePrintableCSS } from "./css-generator";
import { 
  generatePatientInfoSection, 
  generateProviderInfoSection, 
  generateServicesTable, 
  generateNotesSection, 
  generateFooter,
  generateVisitSummary
} from "./html-structure";
import { generatePageHeader } from "./header-generator";

export function buildSeparateDocuments(superbill: Superbill, coverLetterContent?: string): { coverLetterHTML: string; superbillHTML: string } {
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  
  // Calculate total pages
  const coverLetterPages = coverLetterContent && coverLetterContent.trim() !== '' ? 1 : 0;
  const superbillPages = 1;
  const totalPages = coverLetterPages + superbillPages;
  
  // Cover letter HTML WITH header - keeping the page header as requested
  const coverLetterHTML = coverLetterContent && coverLetterContent.trim() !== '' ? `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cover Letter - ${superbill.patientName}</title>
      <style>
        ${generatePrintableCSS()}
        /* Additional styles for clean cover letter */
        .cover-letter-content {
          padding: 0;
          margin: 0;
        }
      </style>
    </head>
    <body class="pdf-optimized">
      <div class="document-page">
        ${generatePageHeader({ 
          superbill, 
          documentType: 'Cover Letter', 
          totalPages, 
          currentPage: 1 
        })}
        
        <div class="page-content">
          <div class="cover-letter-content">
            ${coverLetterContent}
          </div>
        </div>
      </div>
    </body>
    </html>
  ` : '';
  
  // Superbill HTML with header
  const superbillCurrentPage = coverLetterPages + 1;
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
      <div class="document-page">
        ${generatePageHeader({ 
          superbill, 
          documentType: 'Superbill', 
          totalPages, 
          currentPage: superbillCurrentPage 
        })}
        
        <div class="page-content">
          <div class="superbill-title">
            <h2>SUPERBILL</h2>
          </div>
          
          <div class="info-section">
            ${generatePatientInfoSection(superbill, visitDates)}
            ${generateProviderInfoSection(superbill)}
          </div>
          
          ${generateVisitSummary(superbill)}
          
          <div class="services-section">
            <div class="services-title">Services</div>
            ${generateServicesTable(superbill)}
          </div>
          
          ${generateNotesSection(superbill)}
          
          ${generateFooter()}
        </div>
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
