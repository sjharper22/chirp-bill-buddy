import { Superbill } from "@/types/superbill";
import { formatCurrency, formatDate } from "@/lib/utils/format-utils";
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

/**
 * Groups superbills by patient name and generates a combined cover letter
 * that maintains separate sections for each patient
 */
export function generateCoverLetterFromSuperbills(
  superbills: Superbill[],
  includeInvoiceNote = true
): string {
  if (superbills.length === 0) {
    return "";
  }

  // Group superbills by patient name
  const superbillsByPatient: Record<string, Superbill[]> = {};
  
  superbills.forEach(superbill => {
    if (!superbillsByPatient[superbill.patientName]) {
      superbillsByPatient[superbill.patientName] = [];
    }
    superbillsByPatient[superbill.patientName].push(superbill);
  });
  
  // Use the first superbill for clinic info (should be the same for all)
  const firstSuperbill = superbills[0];
  const today = new Date().toLocaleDateString();
  
  // Generate the header portion of the cover letter
  let coverLetterHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px; max-width: 800px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <p style="margin: 0;">${firstSuperbill.clinicName}</p>
        <p style="margin: 0;">${firstSuperbill.clinicAddress}</p>
        <p style="margin: 0;">${firstSuperbill.clinicPhone}</p>
        <p style="margin: 0;">${firstSuperbill.clinicEmail}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>${today}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold;">RE: Request for Reimbursement — Multiple Patient Services</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p>To Whom It May Concern,</p>
        
        <p style="margin-top: 15px; text-indent: 20px;">
          Please find attached detailed superbills for the following patients:
        </p>
      </div>
  `;
  
  // Generate a section for each patient
  Object.entries(superbillsByPatient).forEach(([patientName, patientSuperbills]) => {
    // Calculate patient-specific totals
    const totalVisits = patientSuperbills.reduce((total, sb) => total + sb.visits.length, 0);
    const totalCharges = patientSuperbills.reduce((total, sb) => {
      return total + calculateTotalFee(sb.visits);
    }, 0);
    
    // Determine date range for this patient's visits
    const allVisitDates: Date[] = [];
    patientSuperbills.forEach(sb => {
      sb.visits.forEach(visit => {
        allVisitDates.push(new Date(visit.date));
      });
    });
    
    const earliestDate = allVisitDates.length > 0 
      ? new Date(Math.min(...allVisitDates.map(d => d.getTime()))) 
      : new Date();
    const latestDate = allVisitDates.length > 0 
      ? new Date(Math.max(...allVisitDates.map(d => d.getTime()))) 
      : new Date();
    const visitDateRange = `${formatDate(earliestDate)} - ${formatDate(latestDate)}`;
    
    // Add patient-specific section
    coverLetterHtml += `
      <div style="margin-bottom: 25px; padding: 15px; border-left: 3px solid #eee;">
        <p style="font-weight: bold; margin-bottom: 10px;">${patientName}:</p>
        <ul style="list-style: disc; margin-left: 20px; padding-left: 20px;">
          <li style="margin-bottom: 5px;">
            <strong>${totalVisits}</strong> visits between <strong>${visitDateRange}</strong>
          </li>
          <li style="margin-bottom: 5px;">
            Total charges: <strong>${formatCurrency(totalCharges)}</strong>
          </li>
        </ul>
      </div>
    `;
  });
  
  // Add the common information section at the end
  coverLetterHtml += `
      <div style="margin-bottom: 20px;">
        <p style="text-indent: 20px;">
          Each superbill includes the relevant diagnostic (ICD-10) and procedure (CPT) codes, along with the provider and clinic information needed for out-of-network reimbursement submission.
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
          <li style="margin-bottom: 5px;"><strong>Clinic:</strong> ${firstSuperbill.clinicName}</li>
          <li style="margin-bottom: 5px;"><strong>Provider:</strong> ${firstSuperbill.providerName}</li>
          <li style="margin-bottom: 5px;"><strong>Address:</strong> ${firstSuperbill.clinicAddress}</li>
          <li style="margin-bottom: 5px;"><strong>Phone:</strong> ${firstSuperbill.clinicPhone}</li>
          <li style="margin-bottom: 5px;"><strong>Email:</strong> ${firstSuperbill.clinicEmail}</li>
          <li style="margin-bottom: 5px;"><strong>EIN:</strong> ${firstSuperbill.ein}</li>
          <li style="margin-bottom: 5px;"><strong>NPI:</strong> ${firstSuperbill.npi}</li>
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <p>
          If any further documentation is needed or if questions arise, feel free to contact our office at the above number or email.
        </p>

        <p style="margin-top: 30px;">Sincerely,</p>
        <p style="margin-top: 50px;">${firstSuperbill.providerName}<br/>${firstSuperbill.clinicName}</p>
      </div>
    </div>
  `;
  
  return coverLetterHtml;
}
