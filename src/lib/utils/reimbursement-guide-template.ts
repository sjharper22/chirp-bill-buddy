
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "./superbill-utils";

export function generatePatientReimbursementGuide(superbill: Superbill): string {
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  const totalAmount = superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0);
  
  const visitPeriod = visitDates.length > 1 
    ? `${formatDate(earliestDate)} to ${formatDate(latestDate)}`
    : formatDate(earliestDate);

  return `
    <div style="padding: 40px; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
      <!-- Professional Letterhead -->
      <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #2d5a3d;">
        <img src="/lovable-uploads/baea450a-542f-416b-89bb-74dfadbb180b.png" alt="Collective Family Chiropractic" style="height: 60px; margin-bottom: 15px;" />
        <div style="font-size: 14px; color: #666; margin-top: 10px;">
          <strong>${superbill.clinicName}</strong><br>
          ${superbill.clinicAddress}<br>
          Phone: ${superbill.clinicPhone} | Email: ${superbill.clinicEmail}<br>
          NPI: ${superbill.npi} | EIN: ${superbill.ein}
        </div>
      </div>

      <!-- Date and Patient Info -->
      <div style="text-align: right; margin-bottom: 30px; font-size: 14px;">
        ${formatDate(superbill.issueDate)}
      </div>

      <!-- Main Content -->
      <div style="margin-bottom: 30px;">
        <p style="margin-bottom: 20px; font-size: 16px;"><strong>Dear ${superbill.patientName},</strong></p>
        
        <p style="margin-bottom: 20px;">We hope this letter finds you in good health. Enclosed with this correspondence, you will find your completed superbill documenting the chiropractic services provided during your treatment period from <strong>${visitPeriod}</strong>, totaling <strong>${formatCurrency(totalAmount)}</strong>.</p>
        
        <p style="margin-bottom: 25px;">This comprehensive documentation has been prepared to facilitate your out-of-network insurance reimbursement claim submission. To ensure a smooth and efficient reimbursement process, please follow the step-by-step instructions outlined below:</p>
        
        <!-- Step-by-Step Instructions -->
        <div style="background-color: #f8f9fa; padding: 25px; border-left: 4px solid #2d5a3d; margin-bottom: 25px;">
          <h3 style="color: #2d5a3d; margin-top: 0; margin-bottom: 20px; font-size: 18px;">Insurance Reimbursement Process</h3>
          
          <div style="margin-bottom: 18px;">
            <strong style="color: #2d5a3d;">Step 1: Obtain Your Claim Form</strong><br>
            Contact your insurance provider directly or access their member portal online to download the appropriate out-of-network reimbursement claim form. Most major insurers provide these forms as downloadable PDFs on their websites.
          </div>
          
          <div style="margin-bottom: 18px;">
            <strong style="color: #2d5a3d;">Step 2: Complete All Required Fields</strong><br>
            Carefully fill out all sections of the claim form, ensuring accuracy in your personal information, policy details, and treatment dates. Incomplete forms are the most common cause of claim delays.
          </div>
          
          <div style="margin-bottom: 18px;">
            <strong style="color: #2d5a3d;">Step 3: Prepare Your Documentation Package</strong><br>
            Assemble the following required documents for submission:
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Your completed insurance claim form</li>
              <li>The enclosed superbill (contains all necessary procedure and diagnosis codes)</li>
              <li>Copy of your insurance card (if requested)</li>
              <li>Any additional documentation specified by your insurance provider</li>
            </ul>
          </div>
          
          <div style="margin-bottom: 18px;">
            <strong style="color: #2d5a3d;">Step 4: Submit Your Claim</strong><br>
            Submit your complete documentation package according to your insurance provider's preferred method (online portal, mail, or fax). Always retain copies of all submitted materials for your personal records.
          </div>
          
          <div style="margin-bottom: 18px;">
            <strong style="color: #2d5a3d;">Step 5: Monitor Your Claim Status</strong><br>
            Most insurance providers offer online claim tracking. After processing (typically 2-4 weeks), you will receive an Explanation of Benefits (EOB) detailing your coverage and reimbursement amount.
          </div>
        </div>
        
        <!-- Important Notes -->
        <div style="background-color: #fff3cd; padding: 20px; border: 1px solid #ffeaa7; border-radius: 4px; margin-bottom: 25px;">
          <h4 style="color: #856404; margin-top: 0; margin-bottom: 15px;">Important Reminders:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404;">
            <li style="margin-bottom: 8px;">Submit your claim within your insurance policy's required timeframe (typically 90-365 days from service date)</li>
            <li style="margin-bottom: 8px;">Keep copies of all submitted documents for your records</li>
            <li style="margin-bottom: 8px;">Contact our office if you need additional documentation or have questions about your treatment</li>
          </ul>
        </div>
        
        <p style="margin-bottom: 25px;">Should you require any additional information or assistance with your reimbursement claim, please do not hesitate to contact our office. We are committed to supporting you throughout this process and ensuring you receive the maximum benefits available under your insurance policy.</p>
        
        <p style="margin-bottom: 40px;">Thank you for choosing ${superbill.clinicName} for your healthcare needs. We appreciate your trust in our practice and look forward to continuing to serve your wellness journey.</p>
        
        <!-- Professional Closing -->
        <div style="margin-bottom: 60px;">
          <p style="margin-bottom: 5px;">Warmest regards,</p>
          <div style="margin: 20px 0;">
            <img src="/lovable-uploads/b15651e0-6419-4c8e-ad37-b0626c692134.png" alt="Digital Signature" style="height: 50px;" />
          </div>
          <p style="margin: 0; font-weight: bold;">${superbill.providerName}</p>
          <p style="margin: 0; color: #666;">Doctor of Chiropractic</p>
          <p style="margin: 0; color: #666;">${superbill.clinicName}</p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p style="margin: 0;">This document serves as official documentation of services rendered for insurance reimbursement purposes.</p>
        </div>
      </div>
    </div>
  `;
}
