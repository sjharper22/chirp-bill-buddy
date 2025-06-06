
import { Superbill } from "@/types/superbill";
import { formatCurrency } from "./format-utils";

export function generatePatientReimbursementGuide(superbill: Superbill): string {
  console.log("Generating patient reimbursement guide with comprehensive instructions");
  
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
        <div style="margin: 0 0 20px 0;">Dear ${superbill.patientName},</div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          We hope this letter finds you in good health. Enclosed with this correspondence, you will find your completed 
          superbill documenting the chiropractic services provided during your treatment period from <strong>${visitDateRange}</strong>, 
          totaling <strong>${formatCurrency(totalCharges)}</strong>.
        </div>

        <div style="margin: 0 0 25px 0; text-align: justify;">
          This comprehensive documentation has been prepared to facilitate your out-of-network insurance reimbursement 
          claim submission. To ensure a smooth and efficient reimbursement process, please follow the step-by-step 
          instructions outlined below:
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="font-weight: bold; font-size: 14px; margin: 0 0 15px 0;">Insurance Reimbursement Process</div>

        <div style="margin: 0 0 12px 0;">
          <strong>Step 1: Obtain Your Claim Form</strong><br/>
          Contact your insurance provider or access their online portal to download the out-of-network reimbursement 
          claim form.
        </div>

        <div style="margin: 0 0 12px 0;">
          <strong>Step 2: Complete All Required Fields</strong><br/>
          Fill out all sections accurately, including your personal information, policy details, and treatment dates.
        </div>

        <div style="margin: 0 0 12px 0;">
          <strong>Step 3: Prepare Your Documentation</strong><br/>
          Assemble your completed claim form, the enclosed superbill, and a copy of your insurance card.
        </div>

        <div style="margin: 0 0 12px 0;">
          <strong>Step 4: Submit Your Claim</strong><br/>
          Submit your documentation package via your insurance provider's preferred method (online, mail, or fax). 
          Retain copies for your records.
        </div>

        <div style="margin: 0 0 20px 0;">
          <strong>Step 5: Monitor Your Claim</strong><br/>
          Track your claim status online. Processing typically takes 2-4 weeks, after which you'll receive an 
          Explanation of Benefits (EOB).
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="font-weight: bold; font-size: 14px; margin: 0 0 15px 0;">Important Reminders:</div>
        <ul style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 6px;">Submit within your policy's timeframe (typically 90-365 days)</li>
          <li style="margin-bottom: 6px;">Keep copies of all submitted documents</li>
          <li style="margin-bottom: 6px;">Contact our office for additional assistance if needed</li>
        </ul>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="margin: 0 0 15px 0; text-align: justify;">
          Should you require any additional information or assistance with your reimbursement claim, please do not hesitate 
          to contact our office. We are committed to supporting you throughout this process and ensuring you receive the 
          maximum benefits available under your insurance policy.
        </div>

        <div style="margin: 0 0 15px 0; text-align: justify;">
          Thank you for choosing Collective Family Chiropractic for your healthcare needs. We appreciate your trust in our 
          practice and look forward to continuing to serve your wellness journey.
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
        <div style="margin: 40px 0 0 0;">Warmest regards,</div>
        <div style="margin: 20px 0 0 0;">
          <img src="/lovable-uploads/bda584ce-0b13-415c-9ce7-09e05ad4ed59.png" alt="Jordan Harper Signature" style="height: 60px; width: auto; object-fit: contain; display: block; max-width: 200px;" />
        </div>
        <div style="margin: 10px 0 0 0;"><strong>Jordan Harper</strong><br/>Office Manager<br/>Collective Family Chiropractic</div>
      </div>
    </div>
  `;
}
