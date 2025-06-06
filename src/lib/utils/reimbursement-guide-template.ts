
import { Superbill } from "@/types/superbill";
import { formatCurrency } from "./format-utils";

export function generatePatientReimbursementGuide(superbill: Superbill): string {
  console.log("Generating patient reimbursement guide with Jordan Harper signature");
  
  const totalCharges = superbill.visits.reduce((sum, visit) => sum + (visit.fee || 0), 0);
  const visitDates = superbill.visits.map(visit => new Date(visit.date));
  const earliestDate = new Date(Math.min(...visitDates.map(d => d.getTime())));
  const latestDate = new Date(Math.max(...visitDates.map(d => d.getTime())));
  
  const visitDateRange = visitDates.length === 1 
    ? earliestDate.toLocaleDateString()
    : `${earliestDate.toLocaleDateString()} - ${latestDate.toLocaleDateString()}`;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 12px; max-width: 100%; margin: 0; padding: 20px;">
      <div style="margin-bottom: 30px; text-align: left;">
        <div style="margin: 0;">${new Date().toLocaleDateString()}</div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="font-weight: bold; margin: 0;">RE: Reimbursement Documentation — Services for ${superbill.patientName}</div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="margin: 0 0 20px 0;">Dear ${superbill.patientName},</div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          Please find attached your detailed superbill for <strong>${superbill.visits.length}</strong> 
          visit${superbill.visits.length !== 1 ? 's' : ''} between <strong>${visitDateRange}</strong>, 
          totaling <strong>${formatCurrency(totalCharges)}</strong>.
        </div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          This superbill contains all the necessary information for submitting to your insurance company 
          for out-of-network reimbursement, including diagnostic (ICD-10) and procedure (CPT) codes.
        </div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          To submit for reimbursement, please provide this superbill along with any required claim forms 
          to your insurance company. Many insurance companies also accept electronic submissions through 
          their member portals.
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="margin: 0 0 15px 0;">Our clinic information for your insurance submission:</div>

        <div style="margin-left: 20px; margin-top: 10px;">
          <div style="margin-bottom: 8px;"><strong>Clinic:</strong> ${superbill.clinicName}</div>
          <div style="margin-bottom: 8px;"><strong>Provider:</strong> ${superbill.providerName}</div>
          <div style="margin-bottom: 8px;"><strong>Address:</strong> ${superbill.clinicAddress}</div>
          <div style="margin-bottom: 8px;"><strong>Phone:</strong> ${superbill.clinicPhone}</div>
          <div style="margin-bottom: 8px;"><strong>Email:</strong> ${superbill.clinicEmail}</div>
          <div style="margin-bottom: 8px;"><strong>EIN:</strong> ${superbill.ein}</div>
          <div style="margin-bottom: 8px;"><strong>NPI:</strong> ${superbill.npi}</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <div style="margin: 0 0 15px 0; text-align: justify;">
          If you have any questions about your superbill or need assistance with the reimbursement process, 
          please don't hesitate to contact our office.
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
