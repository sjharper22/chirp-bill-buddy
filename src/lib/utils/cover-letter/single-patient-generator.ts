
import { CoverLetterOptions } from "./types";
import { formatCurrency } from "@/lib/utils/format-utils";

/**
 * Generates HTML content for a single-patient cover letter with comprehensive reimbursement instructions
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
  console.log("Generating enhanced cover letter with comprehensive reimbursement steps");
  
  const letterContent = `
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
          Enclosed with this letter, you will find a superbill summarizing the chiropractic care received at our office for <strong>${patientName}</strong>, covering <strong>${totalVisits}</strong> visits between <strong>${visitDateRange}</strong>, totaling <strong>${formatCurrency(totalCharges)}</strong>, along with individual invoices for your records.
        </div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          These documents are provided to assist you in submitting a reimbursement claim to your insurance provider for out-of-network services.
        </div>

        <div style="margin: 0 0 20px 0; text-align: justify;">
          Below is a simple set of steps to help guide you through the process:
        </div>
      </div>

      <!-- Step-by-step reimbursement process -->
      <div style="margin-bottom: 30px; border: 1px solid #e0e0e0; padding: 20px; background-color: #f9f9f9;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 20px; text-align: center; color: #1a1a1a;">
          Reimbursement Submission Steps
        </div>

        <div style="margin-bottom: 18px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #2c2c2c;">1. Access Your Claim Form</div>
          <div style="margin-left: 15px; line-height: 1.6; color: #444;">
            Log in to your insurance provider's member portal or contact them directly to obtain their standard out-of-network reimbursement form.
          </div>
        </div>

        <div style="margin-bottom: 18px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #2c2c2c;">2. Fill Out the Required Fields</div>
          <div style="margin-left: 15px; line-height: 1.6; color: #444;">
            Complete all necessary sections of the form, including your personal information and the dates of care.
          </div>
        </div>

        <div style="margin-bottom: 18px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #2c2c2c;">3. Attach Supporting Documents</div>
          <div style="margin-left: 15px; line-height: 1.6; color: #444;">
            Include the following with your submission:
            <ul style="margin: 8px 0 0 20px; padding: 0;">
              <li style="margin-bottom: 4px;">The superbill we've provided</li>
              <li style="margin-bottom: 4px;">The attached invoices</li>
              <li style="margin-bottom: 4px;">Your completed claim form</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom: 18px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #2c2c2c;">4. Submit to Your Insurance Provider</div>
          <div style="margin-left: 15px; line-height: 1.6; color: #444;">
            Most providers accept claims by mail, fax, or through a member portal. Be sure to keep a copy for your records.
          </div>
        </div>

        <div style="margin-bottom: 0;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #2c2c2c;">5. Track Your Claim</div>
          <div style="margin-left: 15px; line-height: 1.6; color: #444;">
            After processing, your provider will issue an Explanation of Benefits (EOB) and, if approved, send your reimbursement.
          </div>
        </div>
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
          If your provider requests additional documentation, they're welcome to contact our clinic directly. We're happy to assist if needed.
        </div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          Thank you again for choosing Collective Family Chiropractic. We're honored to be part of your wellness journey.
        </div>

        <div style="margin: 40px 0 0 0;">Sincerely,</div>
        <div style="margin: 20px 0 0 0;">
          <img src="/lovable-uploads/bda584ce-0b13-415c-9ce7-09e05ad4ed59.png" alt="Jordan Harper Signature" style="height: 60px; width: auto; object-fit: contain; display: block; max-width: 200px;" />
        </div>
        <div style="margin: 10px 0 0 0;"><strong>Jordan Harper</strong><br/>Office Manager<br/>Collective Family Chiropractic</div>
      </div>
    </div>
  `;
  
  console.log("Enhanced cover letter generated with comprehensive reimbursement steps");
  return letterContent;
}
