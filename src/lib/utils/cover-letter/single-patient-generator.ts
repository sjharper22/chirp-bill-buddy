
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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 12px; max-width: 100%; margin: 0; padding: 20px;">
      <div style="margin-bottom: 30px; text-align: left;">
        <div style="margin: 0;">${new Date().toLocaleDateString()}</div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="font-weight: bold; margin: 0;">RE: Request for Reimbursement — Services for ${patientName}</div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="margin: 0 0 20px 0;">To Whom It May Concern,</div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          Please find attached a detailed superbill for <strong>${patientName}</strong>, covering
          <strong>${totalVisits}</strong> visits between <strong>${visitDateRange}</strong>, totaling
          <strong>${formatCurrency(totalCharges)}</strong>.
        </div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          This superbill includes the relevant diagnostic (ICD-10) and procedure (CPT) codes, along with the provider and clinic information needed for out-of-network reimbursement submission.
        </div>

        ${
          includeInvoiceNote
            ? `<div style="margin: 0 0 15px 0; text-align: justify;">Invoices for each visit are also included in case your system requires additional documentation.</div>`
            : ''
        }
      </div>

      <div style="margin-bottom: 25px;">
        <div style="margin: 0 0 15px 0;">Clinic and provider information is listed below:</div>

        <div style="margin-left: 20px; margin-top: 10px;">
          <div style="margin-bottom: 8px;"><strong>Clinic:</strong> ${clinicName}</div>
          <div style="margin-bottom: 8px;"><strong>Provider:</strong> ${providerName}</div>
          <div style="margin-bottom: 8px;"><strong>Address:</strong> ${clinicAddress}</div>
          <div style="margin-bottom: 8px;"><strong>Phone:</strong> ${clinicPhone}</div>
          <div style="margin-bottom: 8px;"><strong>Email:</strong> ${clinicEmail}</div>
          <div style="margin-bottom: 8px;"><strong>EIN:</strong> ${ein}</div>
          <div style="margin-bottom: 8px;"><strong>NPI:</strong> ${npi}</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <div style="margin: 0 0 15px 0; text-align: justify;">
          If any further documentation is needed or if questions arise, feel free to contact our office at the above number or email.
        </div>

        <div style="margin: 40px 0 0 0;">Sincerely,</div>
        <div style="margin: 60px 0 0 0;">${providerName}<br/>${clinicName}</div>
      </div>
    </div>
  `;
}
