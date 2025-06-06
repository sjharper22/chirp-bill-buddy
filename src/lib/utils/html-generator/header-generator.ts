
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
    <div class="page-header">
      <div class="header-left">
        <img src="/lovable-uploads/c6ab98f1-de36-4a83-906d-eacf15310b84.png" 
             alt="Collective Family Chiropractic Logo" 
             class="header-logo" />
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
  `;
}

export function generateRunningHeader(config: PageHeaderConfig): string {
  const { superbill, documentType } = config;
  
  return `
    <div class="running-header">
      <div class="running-header-content">
        <div class="running-left">
          <img src="/lovable-uploads/c6ab98f1-de36-4a83-906d-eacf15310b84.png" 
               alt="Logo" 
               class="running-logo" />
          <span class="running-clinic">${superbill.clinicName}</span>
        </div>
        <div class="running-center">
          <span class="running-document-type">${documentType}</span>
          <span class="running-patient">${superbill.patientName}</span>
        </div>
        <div class="running-right">
          <span class="running-date">${formatDate(superbill.issueDate)}</span>
          <span class="running-page">Page <span class="page-counter"></span></span>
        </div>
      </div>
    </div>
  `;
}
