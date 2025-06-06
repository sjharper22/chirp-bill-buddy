
import { Superbill } from "@/types/superbill";
import { generatePrintableCSS } from "./css-generator";
import { 
  generatePatientInfoSection, 
  generateProviderInfoSection, 
  generateServicesTable, 
  generateNotesSection, 
  generateFooter 
} from "./html-structure";
import { generatePageHeader } from "./header-generator";

export function buildSeparateDocuments(superbill: Superbill, coverLetterContent?: string): { coverLetterHTML: string; superbillHTML: string } {
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  
  // Calculate total pages
  const coverLetterPages = coverLetterContent && coverLetterContent.trim() !== '' ? 1 : 0;
  const superbillPages = 1;
  const totalPages = coverLetterPages + superbillPages;
  
  // Cover letter HTML - completely standalone without any headers
  const coverLetterHTML = coverLetterContent && coverLetterContent.trim() !== '' ? `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cover Letter - ${superbill.patientName}</title>
      <style>
        ${generatePrintableCSS()}
        /* Cover letter specific styles - clean and minimal */
        body {
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
          background: white;
        }
        .cover-letter-content {
          width: 100%;
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0;
        }
        /* Remove any header-related styles for cover letters */
        .document-header {
          display: none !important;
        }
        .page-content {
          padding-top: 0 !important;
        }
      </style>
    </head>
    <body>
      <div class="cover-letter-content">
        ${coverLetterContent}
      </div>
    </body>
    </html>
  ` : '';
  
  // Superbill HTML with header (only superbills get the header)
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
