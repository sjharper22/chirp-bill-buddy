
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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 12px; max-width: 100%; margin: 0; padding: 30px; background: #fff;">
      <!-- Date -->
      <div style="margin-bottom: 40px; text-align: left;">
        <div style="margin: 0; font-size: 13px; color: #333;">${new Date().toLocaleDateString()}</div>
      </div>

      <!-- Greeting and Introduction -->
      <div style="margin-bottom: 35px;">
        <div style="margin: 0 0 25px 0; font-size: 13px;">Dear ${superbill.patientName},</div>

        <div style="margin: 0 0 20px 0; text-align: justify; line-height: 1.7; font-size: 12px;">
          We hope this letter finds you in good health. Enclosed with this correspondence, you will find your completed 
          superbill documenting the chiropractic services provided during your treatment period from <strong>${visitDateRange}</strong>, 
          totaling <strong>${formatCurrency(totalCharges)}</strong>.
        </div>

        <div style="margin: 0 0 30px 0; text-align: justify; line-height: 1.7; font-size: 12px;">
          This comprehensive documentation has been prepared to facilitate your out-of-network insurance reimbursement 
          claim submission. To ensure a smooth and efficient reimbursement process, please follow the step-by-step 
          instructions outlined below:
        </div>
      </div>

      <!-- Insurance Reimbursement Process Section -->
      <div style="margin-bottom: 35px;">
        <div style="font-weight: bold; font-size: 15px; margin: 0 0 20px 0; color: #1a1a1a; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px;">
          Insurance Reimbursement Process
        </div>

        <div style="margin: 0 0 18px 0; padding-left: 10px;">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px; color: #2c2c2c;">Step 1: Obtain Your Claim Form</div>
          <div style="margin-left: 15px; line-height: 1.6; font-size: 12px; color: #444;">
            Contact your insurance provider or access their online portal to download the out-of-network reimbursement 
            claim form.
          </div>
        </div>

        <div style="margin: 0 0 18px 0; padding-left: 10px;">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px; color: #2c2c2c;">Step 2: Complete All Required Fields</div>
          <div style="margin-left: 15px; line-height: 1.6; font-size: 12px; color: #444;">
            Fill out all sections accurately, including your personal information, policy details, and treatment dates.
          </div>
        </div>

        <div style="margin: 0 0 18px 0; padding-left: 10px;">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px; color: #2c2c2c;">Step 3: Prepare Your Documentation</div>
          <div style="margin-left: 15px; line-height: 1.6; font-size: 12px; color: #444;">
            Assemble your completed claim form, the enclosed superbill, and a copy of your insurance card.
          </div>
        </div>

        <div style="margin: 0 0 18px 0; padding-left: 10px;">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px; color: #2c2c2c;">Step 4: Submit Your Claim</div>
          <div style="margin-left: 15px; line-height: 1.6; font-size: 12px; color: #444;">
            Submit your documentation package via your insurance provider's preferred method (online, mail, or fax). 
            Retain copies for your records.
          </div>
        </div>

        <div style="margin: 0 0 20px 0; padding-left: 10px;">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px; color: #2c2c2c;">Step 5: Monitor Your Claim</div>
          <div style="margin-left: 15px; line-height: 1.6; font-size: 12px; color: #444;">
            Track your claim status online. Processing typically takes 2-4 weeks, after which you'll receive an 
            Explanation of Benefits (EOB).
          </div>
        </div>
      </div>

      <!-- Important Reminders Section -->
      <div style="margin-bottom: 35px;">
        <div style="font-weight: bold; font-size: 15px; margin: 0 0 15px 0; color: #1a1a1a; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px;">
          Important Reminders:
        </div>
        <ul style="margin: 0; padding-left: 25px; list-style-type: disc;">
          <li style="margin-bottom: 10px; line-height: 1.6; font-size: 12px; color: #444;">Submit within your policy's timeframe (typically 90-365 days)</li>
          <li style="margin-bottom: 10px; line-height: 1.6; font-size: 12px; color: #444;">Keep copies of all submitted documents</li>
          <li style="margin-bottom: 10px; line-height: 1.6; font-size: 12px; color: #444;">Contact our office for additional assistance if needed</li>
        </ul>
      </div>

      <!-- Support Message -->
      <div style="margin-bottom: 35px;">
        <div style="margin: 0 0 18px 0; text-align: justify; line-height: 1.7; font-size: 12px; color: #444;">
          Should you require any additional information or assistance with your reimbursement claim, please do not hesitate 
          to contact our office. We are committed to supporting you throughout this process and ensuring you receive the 
          maximum benefits available under your insurance policy.
        </div>

        <div style="margin: 0 0 20px 0; text-align: justify; line-height: 1.7; font-size: 12px; color: #444;">
          Thank you for choosing Collective Family Chiropractic for your healthcare needs. We appreciate your trust in our 
          practice and look forward to continuing to serve your wellness journey.
        </div>
      </div>

      <!-- Clinic Information Section -->
      <div style="margin-bottom: 35px; background: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; border-radius: 4px;">
        <div style="margin: 0 0 15px 0; font-weight: bold; font-size: 13px; color: #1a1a1a;">
          Our clinic information for your insurance submission:
        </div>

        <div style="margin-left: 0; margin-top: 15px;">
          <div style="margin-bottom: 8px; font-size: 12px;"><strong style="color: #2c2c2c;">Clinic:</strong> <span style="color: #444;">${superbill.clinicName}</span></div>
          <div style="margin-bottom: 8px; font-size: 12px;"><strong style="color: #2c2c2c;">Provider:</strong> <span style="color: #444;">${superbill.providerName}</span></div>
          <div style="margin-bottom: 8px; font-size: 12px;"><strong style="color: #2c2c2c;">Address:</strong> <span style="color: #444;">${superbill.clinicAddress}</span></div>
          <div style="margin-bottom: 8px; font-size: 12px;"><strong style="color: #2c2c2c;">Phone:</strong> <span style="color: #444;">${superbill.clinicPhone}</span></div>
          <div style="margin-bottom: 8px; font-size: 12px;"><strong style="color: #2c2c2c;">Email:</strong> <span style="color: #444;">${superbill.clinicEmail}</span></div>
          <div style="margin-bottom: 8px; font-size: 12px;"><strong style="color: #2c2c2c;">EIN:</strong> <span style="color: #444;">${superbill.ein}</span></div>
          <div style="margin-bottom: 8px; font-size: 12px;"><strong style="color: #2c2c2c;">NPI:</strong> <span style="color: #444;">${superbill.npi}</span></div>
        </div>
      </div>

      <!-- Signature Section -->
      <div style="margin-bottom: 40px; margin-top: 50px;">
        <div style="margin: 0 0 30px 0; font-size: 13px; color: #333;">Warmest regards,</div>
        <div style="margin: 20px 0 0 0;">
          <img src="/lovable-uploads/bda584ce-0b13-415c-9ce7-09e05ad4ed59.png" alt="Jordan Harper Signature" style="height: 60px; width: auto; object-fit: contain; display: block; max-width: 200px;" />
        </div>
        <div style="margin: 15px 0 0 0; line-height: 1.4;">
          <div style="font-weight: bold; font-size: 13px; color: #1a1a1a;">Jordan Harper</div>
          <div style="font-size: 12px; color: #666; margin-top: 2px;">Office Manager</div>
          <div style="font-size: 12px; color: #666; margin-top: 2px;">Collective Family Chiropractic</div>
        </div>
      </div>
    </div>
  `;
}
