
import { Superbill } from "@/types/superbill";
import { formatCurrency } from "@/lib/utils/format-utils";
import { generatePatientSummaries } from "./options-generator";

/**
 * Generates HTML content for a cover letter with multiple patients
 */
export function generateMultiPatientCoverLetter(
  superbills: Superbill[],
  includeInvoiceNote = true
): string {
  if (superbills.length === 0) {
    return "";
  }

  // Use the first superbill for clinic info (should be the same for all)
  const firstSuperbill = superbills[0];
  const today = new Date().toLocaleDateString();
  
  // Get patient summaries
  const patientSummaries = generatePatientSummaries(superbills);
  
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
  patientSummaries.forEach(summary => {
    // Add patient-specific section
    coverLetterHtml += `
      <div style="margin-bottom: 25px; padding: 15px; border-left: 3px solid #eee;">
        <p style="font-weight: bold; margin-bottom: 10px;">${summary.patientName}:</p>
        <ul style="list-style: disc; margin-left: 20px; padding-left: 20px;">
          <li style="margin-bottom: 5px;">
            <strong>${summary.totalVisits}</strong> visits between <strong>${summary.visitDateRange}</strong>
          </li>
          <li style="margin-bottom: 5px;">
            Total charges: <strong>${formatCurrency(summary.totalCharges)}</strong>
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
