
import { Superbill } from "@/types/superbill";
import { formatCurrency } from "@/lib/utils/format-utils";
import { PatientSummary } from "./types";

/**
 * Generates HTML content for a multi-patient cover letter
 */
export function generateMultiPatientCoverLetter(
  superbills: Superbill[],
  includeInvoiceNote = true
): string {
  console.log("Generating multi-patient cover letter with Jordan Harper signature");
  
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
          Please find attached detailed superbills for <strong>${totalPatients} patients</strong>, covering
          <strong>${totalVisits} total visits</strong> between <strong>${overallDateRange}</strong>, totaling
          <strong>${formatCurrency(grandTotal)}</strong>.
        </div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          These superbills include the relevant diagnostic (ICD-10) and procedure (CPT) codes, along with the provider and clinic information needed for out-of-network reimbursement submission.
        </div>

        ${
          includeInvoiceNote
            ? `<div style="margin: 0 0 15px 0; text-align: justify;">Invoices for each visit are also included in case your system requires additional documentation.</div>`
            : ''
        }

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
          If any further documentation is needed or if questions arise, feel free to contact our office at the above number or email.
        </div>

        <div style="margin: 40px 0 0 0;">Sincerely,</div>
        <div style="margin: 20px 0 0 0;">
          <img src="/lovable-uploads/47fb5881-8a7a-4132-ac2a-c9f5e83c01ef.png" alt="Jordan Harper Signature" style="height: 60px; width: auto; object-fit: contain; display: block; max-width: 200px;" />
        </div>
        <div style="margin: 10px 0 0 0;"><strong>Jordan Harper</strong><br/>Office Manager<br/>${clinicName}</div>
      </div>
    </div>
  `;
}
