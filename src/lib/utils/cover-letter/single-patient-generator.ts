
import { CoverLetterOptions } from "./types";
import { formatCurrency } from "@/lib/utils/format-utils";

/**
 * Generates HTML content for a single-patient cover letter
 */
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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px; max-width: 800px; margin: 0 auto; padding: 0;">
      <div style="margin-bottom: 20px; text-align: left;">
        <p style="margin: 0; font-weight: bold;">${clinicName}</p>
        <p style="margin: 0;">${clinicAddress}</p>
        <p style="margin: 0;">${clinicPhone}</p>
        <p style="margin: 0;">${clinicEmail}</p>
      </div>
      
      <div style="margin-bottom: 20px; text-align: left;">
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
