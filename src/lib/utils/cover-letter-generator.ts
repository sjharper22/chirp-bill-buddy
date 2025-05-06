
import { Superbill } from "@/types/superbill";
import { formatCurrency, formatDate } from "@/lib/utils/superbill-utils";
import { calculateTotalFee } from "@/lib/utils/financial-utils";

interface CoverLetterParams {
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
}: CoverLetterParams) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; font-size: 14px; padding: 20px;">
      <p>${new Date().toLocaleDateString()}</p>

      <p>To Whom It May Concern,</p>

      <p>
        Please find attached a detailed superbill for <strong>${patientName}</strong>, covering
        <strong>${totalVisits}</strong> visits between <strong>${visitDateRange}</strong>, totaling
        <strong>${formatCurrency(totalCharges)}</strong>.
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
