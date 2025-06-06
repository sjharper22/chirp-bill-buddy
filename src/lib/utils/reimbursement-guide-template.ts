
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
  const salutation = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  return `
    <div class="professional-document cover-letter">
      <!-- Professional Letterhead -->
      <div class="letterhead">
        <div class="logo-container">
          <img src="/lovable-uploads/a2e25411-48d4-4692-aa1c-835492f68f8f.png" alt="Collective Family Chiropractic" class="clinic-logo" />
          <div>
            <div class="clinic-name">${superbill.clinicName}</div>
            <div class="small-text">Excellence in Chiropractic Care</div>
          </div>
        </div>
        
        <div class="contact-info-grid">
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            ${superbill.clinicAddress}
          </div>
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            ${superbill.clinicPhone}
          </div>
          <div class="contact-item">
            <span class="contact-icon">✉️</span>
            ${superbill.clinicEmail}
          </div>
          <div class="contact-item">
            <span class="contact-icon">🏥</span>
            NPI: ${superbill.npi} | EIN: ${superbill.ein}
          </div>
        </div>
        
        <div style="text-align: right; margin-top: 20px;">
          <span class="date-badge">${formatDate(superbill.issueDate)}</span>
        </div>
      </div>

      <div class="document-body">
        <!-- Reference Information -->
        <div class="info-card" style="margin-bottom: 25px; background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%); border-left: 4px solid #2d5a3d;">
          <div class="info-card-title">
            <span class="info-card-icon">📋</span>
            <span class="section-title">Insurance Reimbursement Request</span>
          </div>
          <div class="body-text">
            <p><strong>Patient Name:</strong> ${superbill.patientName}</p>
            <p><strong>Service Period:</strong> ${visitPeriod}</p>
            <p><strong>Total Service Fees:</strong> ${formatCurrency(totalAmount)}</p>
            <p><strong>Provider:</strong> ${superbill.providerName}</p>
          </div>
        </div>

        <!-- Letter Content -->
        <div class="body-text" style="margin-bottom: 25px;">
          <p style="font-size: 16px; margin-bottom: 20px;"><strong>Dear ${salutation},</strong></p>
          
          <p style="margin-bottom: 20px;">We hope this correspondence finds you in excellent health. Please find enclosed your completed superbill documenting chiropractic services provided by ${superbill.providerName} at ${superbill.clinicName} from ${visitPeriod}, totaling ${formatCurrency(totalAmount)}.</p>
          
          <p style="margin-bottom: 25px;">This superbill serves as official documentation to support your out-of-network insurance reimbursement request. To facilitate your submission process, we have outlined the recommended procedures below:</p>
        </div>
        
        <!-- Step-by-Step Instructions -->
        <div class="services-container" style="margin-bottom: 25px;">
          <div class="services-header">
            <span class="services-icon">📝</span>
            <span style="color: #ffffff; font-weight: 600;">Insurance Claim Submission Process</span>
          </div>
          <div style="padding: 20px; background: #ffffff;">
            <div style="margin-bottom: 20px; padding: 15px; background: #f8fffe; border-left: 3px solid #2d5a3d; border-radius: 4px;">
              <h4 style="color: #2d5a3d; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Step 1: Obtain Your Insurance Claim Form</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.5;">Contact your insurance provider's member services or access their online portal to request the appropriate out-of-network claim form for your policy.</p>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f8fffe; border-left: 3px solid #2d5a3d; border-radius: 4px;">
              <h4 style="color: #2d5a3d; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Step 2: Complete Form Accurately</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.5;">Fill out all required fields with precise information, including your personal details, policy information, treatment dates, and provider data as shown on the enclosed superbill.</p>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f8fffe; border-left: 3px solid #2d5a3d; border-radius: 4px;">
              <h4 style="color: #2d5a3d; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Step 3: Prepare Complete Documentation Package</h4>
              <p style="margin: 0 0 10px 0; font-size: 13px; line-height: 1.5;">Include the following essential documents:</p>
              <ul style="margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.4;">
                <li style="margin-bottom: 4px;">Completed insurance claim form</li>
                <li style="margin-bottom: 4px;">This official superbill</li>
                <li style="margin-bottom: 4px;">Copy of insurance card (both sides)</li>
                <li style="margin-bottom: 4px;">Proof of payment documentation</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f8fffe; border-left: 3px solid #2d5a3d; border-radius: 4px;">
              <h4 style="color: #2d5a3d; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Step 4: Submit Through Preferred Channel</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.5;">Submit your complete documentation package via your insurer's preferred method (online portal, mail, or fax). Retain copies of all submitted materials for your records.</p>
            </div>
            
            <div style="padding: 15px; background: #f8fffe; border-left: 3px solid #2d5a3d; border-radius: 4px;">
              <h4 style="color: #2d5a3d; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Step 5: Monitor Claim Status</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.5;">Claims typically process within 14-30 business days. You will receive an Explanation of Benefits (EOB) detailing the reimbursement determination and any approved benefits.</p>
            </div>
          </div>
        </div>
        
        <!-- Important Reminders -->
        <div class="notes-container" style="background: linear-gradient(135deg, #fff3cd 0%, #fef7e0 100%); border-left: 4px solid #f59e0b; margin-bottom: 25px;">
          <div class="notes-header" style="color: #92400e;">
            <span class="notes-icon">⚠️</span>
            <span class="section-title" style="color: #92400e;">Important Submission Guidelines</span>
          </div>
          <div style="color: #92400e; font-size: 13px; line-height: 1.5;">
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Submit your claim within your provider's specified timeframe (typically 90-365 days from service date)</li>
              <li style="margin-bottom: 8px;">Maintain copies of all submitted documentation for your personal records</li>
              <li style="margin-bottom: 8px;">Contact our office if you require additional documentation or assistance with the claims process</li>
              <li>Follow up with your insurance provider if you don't receive acknowledgment within 10 business days</li>
            </ul>
          </div>
        </div>
        
        <div class="body-text" style="margin-bottom: 30px;">
          <p style="margin-bottom: 20px;">Thank you for entrusting ${superbill.clinicName} with your healthcare needs. We are committed to supporting your wellness journey and ensuring you receive the maximum benefits available through your insurance coverage.</p>
          
          <p style="margin-bottom: 25px;">Should you require any additional documentation or assistance with your insurance claim submission, please do not hesitate to contact our office. We are here to support you throughout this process.</p>
        </div>
        
        <!-- Professional Closing -->
        <div style="margin-bottom: 40px;">
          <p style="margin-bottom: 8px; font-size: 14px;">With warm regards,</p>
          <div style="margin: 20px 0;">
            <img src="/lovable-uploads/b15651e0-6419-4c8e-ad37-b0626c692134.png" alt="Digital Signature" style="height: 80px;" />
          </div>
          <div class="body-text">
            <p style="margin: 0; font-weight: 600; color: #2d5a3d;">Jordan Harper</p>
            <p style="margin: 0; color: #666;">Practice Administrator</p>
            <p style="margin: 0; color: #666;">${superbill.clinicName}</p>
            <div style="margin-top: 8px; font-size: 12px; color: #666;">
              <p style="margin: 2px 0;">📞 ${superbill.clinicPhone}</p>
              <p style="margin: 2px 0;">📧 ${superbill.clinicEmail}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Professional Footer -->
      <div class="professional-footer">
        <div class="footer-content">
          <div>
            <img src="/lovable-uploads/a2e25411-48d4-4692-aa1c-835492f68f8f.png" alt="Practice Logo" class="footer-logo" />
          </div>
          <div class="footer-text">
            <p><strong>CONFIDENTIAL HEALTHCARE COMMUNICATION</strong></p>
            <p>This document contains protected health information and is intended solely for insurance reimbursement purposes.</p>
          </div>
          <div class="date-badge">
            Document ID: ${superbill.id?.substring(0, 8).toUpperCase() || 'SB-' + Date.now().toString().slice(-6)}
          </div>
        </div>
      </div>
    </div>
  `;
}
