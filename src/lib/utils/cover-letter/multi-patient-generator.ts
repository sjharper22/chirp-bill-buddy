
import { Superbill } from "@/types/superbill";
import { formatCurrency } from "@/lib/utils/format-utils";
import { PatientSummary } from "./types";

/**
 * Generates HTML content for a multi-patient cover letter with comprehensive reimbursement instructions
 */
export function generateMultiPatientCoverLetter(
  superbills: Superbill[],
  includeInvoiceNote = true
): string {
  console.log("Generating enhanced multi-patient cover letter with comprehensive reimbursement steps");
  
  if (superbills.length === 0) {
    return "";
  }

  // Get clinic info from the first superbill (assuming all are from same clinic)
  const firstSuperbill = superbills[0];
  const clinicName = firstSuperbill.clinicName;
  const clinicAddress = firstSuperbill.clinicAddress;
  const clinicPhone = firstSuperbill.clinicPhone;
  const clinicEmail = firstSuperbill.clinicEmail;
  const ein = firstSuperbill.ein;
  const npi = firstSuperbill.npi;

  // Calculate totals and summaries
  const patientSummaries: PatientSummary[] = superbills.map(superbill => {
    const visitDates = superbill.visits.map(visit => new Date(visit.date));
    const totalCharges = superbill.visits.reduce((sum, visit) => sum + (visit.fee || 0), 0);
    
    const earliestDate = new Date(Math.min(...visitDates.map(d => d.getTime())));
    const latestDate = new Date(Math.max(...visitDates.map(d => d.getTime())));
    
    return {
      patientName: superbill.patientName,
      visitDates,
      totalVisits: superbill.visits.length,
      totalCharges,
      visitDateRange: visitDates.length === 1 
        ? earliestDate.toLocaleDateString()
        : `${earliestDate.toLocaleDateString()} - ${latestDate.toLocaleDateString()}`
    };
  });

  const totalPatients = patientSummaries.length;
  const totalVisits = patientSummaries.reduce((sum, patient) => sum + patient.totalVisits, 0);
  const grandTotal = patientSummaries.reduce((sum, patient) => sum + patient.totalCharges, 0);

  // Get overall date range
  const allDates = patientSummaries.flatMap(p => p.visitDates);
  const earliestOverallDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const latestOverallDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const overallDateRange = allDates.length === 1 
    ? earliestOverallDate.toLocaleDateString()
    : `${earliestOverallDate.toLocaleDateString()} - ${latestOverallDate.toLocaleDateString()}`;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 12px; max-width: 100%; margin: 0; padding: 20px;">
      <div style="margin-bottom: 30px; text-align: left;">
        <div style="margin: 0;">${new Date().toLocaleDateString()}</div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="font-weight: bold; margin: 0;">RE: Request for Reimbursement — Services for Multiple Patients</div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="margin: 0 0 20px 0;">To Whom It May Concern,</div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          Enclosed with this letter, you will find superbills summarizing the chiropractic care received at our office for <strong>${totalPatients} patients</strong>, covering <strong>${totalVisits} total visits</strong> between <strong>${overallDateRange}</strong>, totaling <strong>${formatCurrency(grandTotal)}</strong>, along with individual invoices for your records.
        </div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          These documents are provided to assist you in submitting reimbursement claims to your insurance provider for out-of-network services.
        </div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          The patients included in this submission are:
        </div>

        <div style="margin-left: 20px; margin-bottom: 15px;">
          ${patientSummaries.map(patient => `
            <div style="margin-bottom: 8px;">
              <strong>${patient.patientName}</strong> - ${patient.totalVisits} visit${patient.totalVisits !== 1 ? 's' : ''} (${patient.visitDateRange}) - ${formatCurrency(patient.totalCharges)}
            </div>
          `).join('')}
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
            Complete all necessary sections of the form, including your personal information and the dates of care for each patient.
          </div>
        </div>

        <div style="margin-bottom: 18px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #2c2c2c;">3. Attach Supporting Documents</div>
          <div style="margin-left: 15px; line-height: 1.6; color: #444;">
            Include the following with your submission:
            <ul style="margin: 8px 0 0 20px; padding: 0;">
              <li style="margin-bottom: 4px;">The superbills we've provided for each patient</li>
              <li style="margin-bottom: 4px;">The attached invoices for all visits</li>
              <li style="margin-bottom: 4px;">Your completed claim forms</li>
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
}
