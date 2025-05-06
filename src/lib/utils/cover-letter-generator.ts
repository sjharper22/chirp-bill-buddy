
import { Superbill } from "@/types/superbill";
import { formatCurrency, formatDate } from "@/lib/utils/superbill-utils";
import { calculateTotalFee } from "@/lib/utils/financial-utils";

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

export function generateOptionsFromSuperbill(superbill: Superbill, includeInvoiceNote = true): CoverLetterOptions {
  const totalVisits = superbill.visits.length;
  const totalCharges = calculateTotalFee(superbill.visits);
  
  // Find date range for visits
  const sortedVisits = [...superbill.visits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const earliestDate = sortedVisits.length > 0 ? new Date(sortedVisits[0].date) : new Date();
  const latestDate = sortedVisits.length > 0 
    ? new Date(sortedVisits[sortedVisits.length - 1].date) 
    : new Date();
    
  const visitDateRange = `${formatDate(earliestDate)} - ${formatDate(latestDate)}`;
  
  return {
    patientName: superbill.patientName,
    totalVisits,
    totalCharges,
    visitDateRange,
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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px; max-width: 800px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <p style="margin: 0;">${clinicName}</p>
        <p style="margin: 0;">${clinicAddress}</p>
        <p style="margin: 0;">${clinicPhone}</p>
        <p style="margin: 0;">${clinicEmail}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold;">RE: Request for Reimbursement — Services for ${patientName}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p>To Whom It May Concern,</p>

        <p style="margin-top: 15px; text-indent: 20px;">
          Please find attached a detailed superbill for <strong>${patientName}</strong>, covering
          <strong>${totalVisits}</strong> visits between <strong>${visitDateRange}</strong>, totaling
          <strong>${formatCurrency(totalCharges)}</strong>.
        </p>

        <p style="margin-top: 15px; text-indent: 20px;">
          This superbill includes the relevant diagnostic (ICD-10) and procedure (CPT) codes, along with the provider and clinic information needed for out-of-network reimbursement submission.
        </p>

        ${
          includeInvoiceNote
            ? `<p style="margin-top: 15px; text-indent: 20px;">Invoices for each visit are also included in case your system requires additional documentation.</p>`
            : ''
        }
      </div>

      <div style="margin-bottom: 20px;">
        <p>Clinic and provider information is listed below:</p>

        <ul style="list-style: none; padding-left: 20px; margin-top: 10px;">
          <li style="margin-bottom: 5px;"><strong>Clinic:</strong> ${clinicName}</li>
          <li style="margin-bottom: 5px;"><strong>Provider:</strong> ${providerName}</li>
          <li style="margin-bottom: 5px;"><strong>Address:</strong> ${clinicAddress}</li>
          <li style="margin-bottom: 5px;"><strong>Phone:</strong> ${clinicPhone}</li>
          <li style="margin-bottom: 5px;"><strong>Email:</strong> ${clinicEmail}</li>
          <li style="margin-bottom: 5px;"><strong>EIN:</strong> ${ein}</li>
          <li style="margin-bottom: 5px;"><strong>NPI:</strong> ${npi}</li>
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <p>
          If any further documentation is needed or if questions arise, feel free to contact our office at the above number or email.
        </p>

        <p style="margin-top: 30px;">Sincerely,</p>
        <p style="margin-top: 50px;">${providerName}<br/>${clinicName}</p>
      </div>
    </div>
  `;
}

export function generateCoverLetterFromSuperbills(
  superbills: Superbill[],
  includeInvoiceNote = true
): string {
  if (superbills.length === 0) {
    return "";
  }

  // Use the first superbill for patient and clinic info
  const superbill = superbills[0];
  
  // Calculate total visits and fees across all superbills
  const totalVisits = superbills.reduce((total, sb) => total + sb.visits.length, 0);
  const totalCharges = superbills.reduce((total, sb) => {
    const superbillTotal = calculateTotalFee(sb.visits);
    return total + superbillTotal;
  }, 0);

  // Determine date range across all visits in all superbills
  const allVisitDates: Date[] = [];
  superbills.forEach(sb => {
    sb.visits.forEach(visit => {
      allVisitDates.push(new Date(visit.date));
    });
  });
  
  const earliestDate = allVisitDates.length > 0 ? new Date(Math.min(...allVisitDates.map(d => d.getTime()))) : new Date();
  const latestDate = allVisitDates.length > 0 ? new Date(Math.max(...allVisitDates.map(d => d.getTime()))) : new Date();
  const visitDateRange = `${formatDate(earliestDate)} - ${formatDate(latestDate)}`;

  // Generate the cover letter using the consolidated information
  return generateCoverLetter({
    patientName: superbill.patientName,
    totalVisits,
    totalCharges,
    visitDateRange,
    providerName: superbill.providerName,
    clinicName: superbill.clinicName,
    clinicAddress: superbill.clinicAddress,
    clinicPhone: superbill.clinicPhone,
    clinicEmail: superbill.clinicEmail,
    ein: superbill.ein,
    npi: superbill.npi,
    includeInvoiceNote
  });
}
