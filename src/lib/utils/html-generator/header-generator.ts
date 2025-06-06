
import { Superbill } from "@/types/superbill";
import { formatDate } from "../superbill-utils";

export interface PageHeaderConfig {
  superbill: Superbill;
  documentType: 'Cover Letter' | 'Superbill';
  totalPages?: number;
  currentPage?: number;
}

export function generatePageHeader(config: PageHeaderConfig): string {
  const { superbill, documentType, totalPages = 1, currentPage = 1 } = config;
  
  return `
    <div class="document-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-logo">
            <img src="/lovable-uploads/0d176244-e119-4e77-bd6b-42cd02db00d2.png" alt="Collective Family Chiropractic Logo" class="logo-image" />
          </div>
          <div class="header-clinic-info">
            <div class="clinic-name">${superbill.clinicName}</div>
            <div class="clinic-contact">${superbill.clinicPhone} | ${superbill.clinicEmail}</div>
          </div>
        </div>
        <div class="header-right">
          <div class="document-info">
            <div class="document-type">${documentType}</div>
            <div class="patient-name">${superbill.patientName}</div>
            <div class="document-date">${formatDate(superbill.issueDate)}</div>
          </div>
          <div class="page-number">
            Page ${currentPage} of ${totalPages}
          </div>
        </div>
      </div>
      <div class="header-divider"></div>
    </div>
  `;
}

// Create headers for each page of a multi-page document
export function generateMultiPageHeaders(config: PageHeaderConfig, contentSections: string[]): string[] {
  const { superbill, documentType, totalPages = contentSections.length } = config;
  
  return contentSections.map((content, index) => {
    const pageConfig = {
      ...config,
      currentPage: index + 1,
      totalPages
    };
    
    return `
      <div class="page-container">
        ${generatePageHeader(pageConfig)}
        <div class="page-content">
          ${content}
        </div>
      </div>
    `;
  });
}
