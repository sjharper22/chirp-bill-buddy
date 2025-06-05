
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "./superbill-utils";

export function generatePatientReimbursementGuide(superbill: Superbill): string {
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  const totalAmount = superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0);
  
  const visitPeriod = visitDates.length > 1 
    ? `${formatDate(earliestDate)} – ${formatDate(latestDate)}`
    : formatDate(earliestDate);

  // Split patient name for salutation
  const nameParts = superbill.patientName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const salutation = lastName ? `${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}` : superbill.patientName;

  return `
    <div style="padding: 15px; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; page-break-inside: avoid;">
      <!-- Professional Letterhead -->
      <div style="text-align: left; margin-bottom: 30px; padding: 20px 30px; border-bottom: 2px solid #e5e7eb; background: #ffffff;">
        <div style="margin-bottom: 15px; text-align: left; width: 100%;">
          <img src="/lovable-uploads/baea450a-542f-416b-89bb-74dfadbb180b.png" alt="Collective Family Chiropractic" style="height: 30px; width: auto; object-fit: contain;" />
        </div>
        <div style="text-align: left; margin-bottom: 12px;">
          <div style="font-size: 16px; color: #374151; font-weight: 600; margin-bottom: 4px;">${superbill.clinicName}</div>
        </div>
        <div style="text-align: left; font-size: 14px; color: #6b7280; font-weight: 500; line-height: 1.4;">
          ${superbill.clinicAddress}<br>
          Phone: ${superbill.clinicPhone} | Email: ${superbill.clinicEmail}<br>
          NPI: ${superbill.npi} | EIN: ${superbill.ein}
        </div>
        <div style="text-align: right; margin-top: 15px; font-size: 14px; color: #6b7280;">
          ${formatDate(superbill.issueDate)}
        </div>
      </div>

      <!-- Reference Line -->
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <p style="margin: 0; font-weight: bold; font-size: 16px;">
          <strong>RE: Superbill for Out-of-Network Reimbursement</strong><br>
          <strong>Patient:</strong> ${superbill.patientName}<br>
          <strong>Dates of Service:</strong> ${visitPeriod}<br>
          <strong>Total Amount:</strong> ${formatCurrency(totalAmount)}
        </p>
      </div>

      <!-- Letter Content -->
      <div style="margin-bottom: 20px;">
        <p style="margin-bottom: 20px; font-size: 16px;"><strong>Dear ${salutation},</strong></p>
        
        <p style="margin-bottom: 20px;">We hope this message finds you well. Enclosed, please find your completed superbill documenting chiropractic services provided by ${superbill.providerName} at ${superbill.clinicName} from ${visitPeriod}, totaling ${formatCurrency(totalAmount)}.</p>
        
        <p style="margin-bottom: 20px;">This superbill serves as official documentation to support your out-of-network insurance reimbursement request. To assist you in the submission process, we've outlined the recommended steps below:</p>
        
        <!-- Step-by-Step Instructions -->
        <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #2d5a3d; margin-bottom: 20px; page-break-inside: avoid;">
          <h3 style="color: #2d5a3d; margin-top: 0; margin-bottom: 15px; font-size: 18px;">📝 How to Submit Your Reimbursement Claim</h3>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2d5a3d;">Step 1: Obtain Your Insurance Claim Form</strong><br>
            Visit your provider's member portal or call them directly to request their out-of-network claim form.
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2d5a3d;">Step 2: Complete the Form Accurately</strong><br>
            Fill out all required fields, including your personal and policy details, treatment dates, and provider information.
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2d5a3d;">Step 3: Prepare Your Submission Packet</strong><br>
            Include the following:
            <ul style="margin: 10px 0 0 20px; padding-left: 0;">
              <li style="margin-bottom: 5px;">Your completed claim form</li>
              <li style="margin-bottom: 5px;">The enclosed superbill</li>
              <li style="margin-bottom: 5px;">A copy of your insurance card (front and back)</li>
              <li style="margin-bottom: 5px;">Proof of payment (bank statement, receipt, or payment confirmation)</li>
            </ul>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2d5a3d;">Step 4: Submit to Your Insurance Provider</strong><br>
            Send your full packet via your insurer's preferred method (portal upload, mail, or fax). Be sure to retain copies of everything you submit.
          </div>
          
          <div>
            <strong style="color: #2d5a3d;">Step 5: Follow Up on Your Claim</strong><br>
            Claims typically process within 2–4 weeks. You will receive an Explanation of Benefits (EOB) indicating your reimbursement status.
          </div>
        </div>
        
        <!-- Important Reminders -->
        <div style="background-color: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 4px; margin-bottom: 20px; page-break-inside: avoid;">
          <h4 style="color: #856404; margin-top: 0; margin-bottom: 10px;">🔔 Important Notes</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404;">
            <li style="margin-bottom: 5px;">Submit your claim within your provider's policy window (typically 90–365 days from the date of service)</li>
            <li style="margin-bottom: 5px;">Keep copies of all documents submitted for your records</li>
            <li>If your insurer requires additional documentation or if you need assistance at any point, please don't hesitate to reach out. We're happy to help</li>
          </ul>
        </div>
        
        <p style="margin-bottom: 20px;">Thank you for allowing us to support your health and wellness journey. We're honored to be a part of your care and look forward to continuing to serve your health needs.</p>
        
        <!-- Professional Closing -->
        <div style="margin-bottom: 40px; page-break-inside: avoid;">
          <p style="margin-bottom: 5px;">Warmly,</p>
          <div style="margin: 15px 0;">
            <img src="/lovable-uploads/b15651e0-6419-4c8e-ad37-b0626c692134.png" alt="Digital Signature" style="height: 100px;" />
          </div>
          <p style="margin: 0; font-weight: bold;">Jordan Harper</p>
          <p style="margin: 0; color: #666;">Office Manager</p>
          <p style="margin: 0; color: #666;">${superbill.clinicName}</p>
          <p style="margin: 5px 0 0 0; color: #666;">📞 ${superbill.clinicPhone}</p>
          <p style="margin: 0; color: #666;">📧 ${superbill.clinicEmail}</p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; page-break-inside: avoid;">
          <p style="margin: 0;">This document serves as official documentation of services rendered for insurance reimbursement purposes.</p>
        </div>
      </div>
    </div>
  `;
}
