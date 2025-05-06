
import { Superbill } from "@/types/superbill";
import { formatDate } from "./superbill-utils";

export interface CoverLetterOptions {
  patientName: string;
  totalVisits: number;
  totalCharges: number;
  visitDateRange: string;
  providerName: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  ein: string;
  npi: string;
  includeInvoiceNote?: boolean;
}

export function generateCoverLetter({
  patientName,
  totalVisits,
  totalCharges,
  visitDateRange,
  providerName,
  clinicName,
  clinicAddress,
  clinicPhone,
  clinicEmail,
  ein,
  npi,
  includeInvoiceNote = true,
}: CoverLetterOptions) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; font-size: 14px; padding: 20px;">
      <p>${new Date().toLocaleDateString()}</p>

      <p>To Whom It May Concern,</p>

      <p>
        Please find attached a detailed superbill for <strong>${patientName}</strong>, covering
        <strong>${totalVisits}</strong> visits between <strong>${visitDateRange}</strong>, totaling
        <strong>$${totalCharges.toFixed(2)}</strong>.
      </p>

      <p>
        This superbill includes the relevant diagnostic (ICD-10) and procedure (CPT) codes, along with the provider and clinic information needed for out-of-network reimbursement submission.
      </p>

      ${
        includeInvoiceNote
          ? `<p>Invoices for each visit are also included in case your system requires additional documentation.</p>`
          : ''
      }

      <p>Clinic and provider information is listed below:</p>

      <ul style="list-style: none; padding: 0; margin: 0;">
        <li><strong>Clinic:</strong> ${clinicName}</li>
        <li><strong>Provider:</strong> ${providerName}</li>
        <li><strong>Address:</strong> ${clinicAddress}</li>
        <li><strong>Phone:</strong> ${clinicPhone}</li>
        <li><strong>Email:</strong> ${clinicEmail}</li>
        <li><strong>EIN:</strong> ${ein}</li>
        <li><strong>NPI:</strong> ${npi}</li>
      </ul>

      <p>
        If any further documentation is needed or if questions arise, feel free to contact our office at the above number or email.
      </p>

      <p>Sincerely,</p>
      <p>${providerName}<br/>${clinicName}</p>
    </div>
  `;
}

// Generate cover letter options from a superbill
export function generateOptionsFromSuperbill(superbill: Superbill, includeInvoiceNote: boolean = true): CoverLetterOptions {
  // Calculate date range
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : new Date();
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : new Date();
  const dateRange = `${formatDate(earliestDate)} to ${formatDate(latestDate)}`;
  
  // Calculate total charges
  const totalCharges = superbill.visits.reduce((sum, visit) => sum + visit.fee, 0);
  
  return {
    patientName: superbill.patientName,
    totalVisits: superbill.visits.length,
    totalCharges,
    visitDateRange: dateRange,
    providerName: superbill.providerName,
    clinicName: superbill.clinicName,
    clinicAddress: superbill.clinicAddress,
    clinicPhone: superbill.clinicPhone,
    clinicEmail: superbill.clinicEmail,
    ein: superbill.ein,
    npi: superbill.npi,
    includeInvoiceNote
  };
}

// Generate cover letter from multiple superbills
export function generateCoverLetterFromSuperbills(superbills: Superbill[], includeInvoiceNote: boolean = true): string {
  if (superbills.length === 0) return '';
  
  const totalVisits = superbills.reduce((total, bill) => total + bill.visits.length, 0);
  const totalCharges = superbills.reduce((total, bill) => {
    return total + bill.visits.reduce((subtotal, visit) => subtotal + visit.fee, 0);
  }, 0);
  
  // Find the earliest and latest dates across all superbills
  let earliestDate: Date | null = null;
  let latestDate: Date | null = null;
  
  superbills.forEach(bill => {
    bill.visits.forEach(visit => {
      const visitDate = new Date(visit.date);
      if (!earliestDate || visitDate < earliestDate) {
        earliestDate = visitDate;
      }
      if (!latestDate || visitDate > latestDate) {
        latestDate = visitDate;
      }
    });
  });
  
  const dateRange = (earliestDate && latestDate) 
    ? `${formatDate(earliestDate)} to ${formatDate(latestDate)}`
    : 'N/A';
  
  // Use the first superbill for provider/clinic information
  const firstSuperbill = superbills[0];
  const patientNames = Array.from(new Set(superbills.map(bill => bill.patientName))).join(", ");
  
  return generateCoverLetter({
    patientName: patientNames,
    totalVisits,
    totalCharges,
    visitDateRange: dateRange,
    providerName: firstSuperbill.providerName,
    clinicName: firstSuperbill.clinicName,
    clinicAddress: firstSuperbill.clinicAddress,
    clinicPhone: firstSuperbill.clinicPhone,
    clinicEmail: firstSuperbill.clinicEmail,
    ein: firstSuperbill.ein,
    npi: firstSuperbill.npi,
    includeInvoiceNote
  });
}
