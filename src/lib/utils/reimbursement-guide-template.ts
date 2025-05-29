
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
    <div style="padding: 40px; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; page-break-inside: avoid;">
      <!-- Professional Letterhead with Logo in Upper Left -->
      <div style="display: flex; align-items: flex-start; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #2d5a3d;">
        <div style="flex-shrink: 0; margin-right: 20px;">
          <img src="/lovable-uploads/baea450a-542f-416b-89bb-74dfadbb180b.png" alt="Collective Family Chiropractic" style="height: 40px;" />
        </div>
        <div style="flex-grow: 1;">
          <div style="font-size: 14px; color: #666;">
            <strong>${superbill.clinicName}</strong><br>
            ${superbill.clinicAddress}<br>
            Phone: ${superbill.clinicPhone} | Email: ${superbill.clinicEmail}<br>
            NPI: ${superbill.npi} | EIN: ${superbill.ein}
          </div>
        </div>
        <div style="text-align: right; font-size: 14px; color: #666;">
          ${formatDate(superbill.issueDate)}
        </div>
      </div>

      <!-- Letter Content -->
      <div style="margin-bottom: 20px;">
        <p style="margin-bottom: 20px; font-size: 16px;"><strong>Dear ${superbill.patientName},</strong></p>
        
        <p style="margin-bottom: 20px;">We hope this letter finds you in good health. Enclosed with this correspondence, you will find your completed superbill documenting the chiropractic services provided during your treatment period from <strong>${visitPeriod}</strong>, totaling <strong>${formatCurrency(totalAmount)}</strong>.</p>
        
        <p style="margin-bottom: 20px;">This comprehensive documentation has been prepared to facilitate your out-of-network insurance reimbursement claim submission. To ensure a smooth and efficient reimbursement process, please follow the step-by-step instructions outlined below:</p>
        
        <!-- Step-by-Step Instructions -->
        <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #2d5a3d; margin-bottom: 20px; page-break-inside: avoid;">
          <h3 style="color: #2d5a3d; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Insurance Reimbursement Process</h3>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2d5a3d;">Step 1: Obtain Your Claim Form</strong><br>
            Contact your insurance provider or access their online portal to download the out-of-network reimbursement claim form.
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2d5a3d;">Step 2: Complete All Required Fields</strong><br>
            Fill out all sections accurately, including your personal information, policy details, and treatment dates.
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2d5a3d;">Step 3: Prepare Your Documentation</strong><br>
            Assemble your completed claim form, the enclosed superbill, and a copy of your insurance card.
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2d5a3d;">Step 4: Submit Your Claim</strong><br>
            Submit your documentation package via your insurance provider's preferred method (online, mail, or fax). Retain copies for your records.
          </div>
          
          <div>
            <strong style="color: #2d5a3d;">Step 5: Monitor Your Claim</strong><br>
            Track your claim status online. Processing typically takes 2-4 weeks, after which you'll receive an Explanation of Benefits (EOB).
          </div>
        </div>
        
        <!-- Important Reminders -->
        <div style="background-color: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 4px; margin-bottom: 20px; page-break-inside: avoid;">
          <h4 style="color: #856404; margin-top: 0; margin-bottom: 10px;">Important Reminders:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404;">
            <li style="margin-bottom: 5px;">Submit within your policy's timeframe (typically 90-365 days)</li>
            <li style="margin-bottom: 5px;">Keep copies of all submitted documents</li>
            <li>Contact our office for additional assistance if needed</li>
          </ul>
        </div>
        
        <p style="margin-bottom: 20px;">Should you require any additional information or assistance with your reimbursement claim, please do not hesitate to contact our office. We are committed to supporting you throughout this process and ensuring you receive the maximum benefits available under your insurance policy.</p>
        
        <p style="margin-bottom: 30px;">Thank you for choosing ${superbill.clinicName} for your healthcare needs. We appreciate your trust in our practice and look forward to continuing to serve your wellness journey.</p>
        
        <!-- Professional Closing -->
        <div style="margin-bottom: 40px; page-break-inside: avoid;">
          <p style="margin-bottom: 5px;">Warmest regards,</p>
          <div style="margin: 15px 0;">
            <img src="/lovable-uploads/b15651e0-6419-4c8e-ad37-b0626c692134.png" alt="Digital Signature" style="height: 40px;" />
          </div>
          <p style="margin: 0; font-weight: bold;">Jordan Harper</p>
          <p style="margin: 0; color: #666;">Office Manager</p>
          <p style="margin: 0; color: #666;">${superbill.clinicName}</p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p style="margin: 0;">This document serves as official documentation of services rendered for insurance reimbursement purposes.</p>
        </div>
      </div>
    </div>
  `;
}
