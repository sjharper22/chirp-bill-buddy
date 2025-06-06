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
      <div style="margin-bottom: 30px; text-align: center;">
        <h1 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">Out-of-Network Insurance Reimbursement Guide & Cover Sheet</h1>
        <p style="margin: 0; font-style: italic; color: #666;">Supporting your wellness — every step of the way</p>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 15px 0; text-align: justify;">
          This comprehensive documentation has been prepared to facilitate your out-of-network insurance reimbursement 
          claim submission. To ensure a smooth and efficient reimbursement process, please follow the step-by-step 
          instructions outlined below:
        </p>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #2c5aa0;">Patient & Superbill Summary</h2>
        
        <div style="margin-left: 20px;">
          <div style="margin-bottom: 8px;"><strong>Patient Name:</strong> ${superbill.patientName}</div>
          <div style="margin-bottom: 8px;"><strong>Date of Birth:</strong> ${new Date(superbill.patientDob).toLocaleDateString()}</div>
          <div style="margin-bottom: 8px;"><strong>Dates of Service:</strong> ${visitDateRange}</div>
          <div style="margin-bottom: 8px;"><strong>Total Number of Visits:</strong> ${superbill.visits.length}</div>
          <div style="margin-bottom: 8px;"><strong>Total Charges:</strong> ${formatCurrency(totalCharges)}</div>
        </div>
        
        <div style="margin: 15px 0; padding: 10px; background-color: #f0f8ff; border-left: 4px solid #2c5aa0;">
          <strong>Note:</strong> This is not a bill. It is a superbill, a detailed receipt to support your claim for insurance reimbursement.
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #2c5aa0;">Insurance Reimbursement Process</h2>
        
        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold;">Step 1: Obtain Your Claim Form</h3>
          <p style="margin: 0 0 10px 20px;">Contact your insurance provider or access their online portal to download the out-of-network reimbursement claim form.</p>
        </div>

        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold;">Step 2: Complete All Required Fields</h3>
          <p style="margin: 0 0 10px 20px;">Fill out all sections accurately, including your personal information, policy details, and treatment dates.</p>
        </div>

        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold;">Step 3: Prepare Your Documentation</h3>
          <p style="margin: 0 0 10px 20px;">Assemble your completed claim form, the enclosed superbill, and a copy of your insurance card.</p>
        </div>

        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold;">Step 4: Submit Your Claim</h3>
          <p style="margin: 0 0 10px 20px;">Submit your documentation package via your insurance provider's preferred method (online, mail, or fax). Retain copies for your records.</p>
        </div>

        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold;">Step 5: Monitor Your Claim</h3>
          <p style="margin: 0 0 10px 20px;">Track your claim status online. Processing typically takes 2-4 weeks, after which you'll receive an Explanation of Benefits (EOB).</p>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #b8860b;">Important Reminders:</h2>
        <ul style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Submit within your policy's timeframe (typically 90-365 days)</li>
          <li style="margin-bottom: 8px;">Keep copies of all submitted documents</li>
          <li style="margin-bottom: 8px;">Contact our office for additional assistance if needed</li>
        </ul>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #2c5aa0;">Clinic Information for Insurance Use</h2>
        
        <div style="margin-left: 20px;">
          <div style="margin-bottom: 8px;"><strong>Provider:</strong> ${superbill.providerName}</div>
          <div style="margin-bottom: 8px;"><strong>Clinic:</strong> ${superbill.clinicName}</div>
          <div style="margin-bottom: 8px;"><strong>Address:</strong> ${superbill.clinicAddress}</div>
          <div style="margin-bottom: 8px;"><strong>Phone:</strong> ${superbill.clinicPhone}</div>
          <div style="margin-bottom: 8px;"><strong>Email:</strong> ${superbill.clinicEmail}</div>
          <div style="margin-bottom: 8px;"><strong>EIN:</strong> ${superbill.ein}</div>
          <div style="margin-bottom: 8px;"><strong>NPI #:</strong> ${superbill.npi}</div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #2c5aa0;">Final Checklist Before You Submit</h2>
        <ul style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 5px;">☐ Claim form is complete</li>
          <li style="margin-bottom: 5px;">☐ Superbill is attached</li>
          <li style="margin-bottom: 5px;">☐ You have kept a copy for your records</li>
          <li style="margin-bottom: 5px;">☐ You know how to follow up</li>
        </ul>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #2c5aa0;">Need Help?</h2>
        <p style="margin: 0 0 15px 0;">
          If you misplace this form or have questions, we're here to support you. You can visit our help page, 
          which has FAQs and more information.
        </p>
      </div>

      <div style="margin-bottom: 30px;">
        <p style="margin: 0 0 15px 0; text-align: center; font-weight: bold;">
          Thank you for choosing our clinic. We're honored to be a part of your wellness journey!
        </p>

        <div style="margin: 40px 0 0 0;">Sincerely,</div>
        <div style="margin: 20px 0 0 0;">
          <img src="/lovable-uploads/05aaaac1-bb35-4d75-8959-dd4744f3a350.png" alt="Jordan Harper Signature" style="height: 60px; width: auto; object-fit: contain; display: block; max-width: 200px;" />
        </div>
        <div style="margin: 10px 0 0 0;"><strong>Jordan Harper</strong><br/>Office Manager<br/>Collective Family Chiropractic</div>
      </div>
    </div>
  `;
}
