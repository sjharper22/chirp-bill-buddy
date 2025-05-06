
import { Superbill } from "@/types/superbill";
import { formatDate } from "@/lib/utils/superbill-utils";

/**
 * Generates an HTML formatted patient reimbursement guide with proper line breaks and formatting
 */
export function generatePatientReimbursementGuide(superbill: Superbill): string {
  const today = formatDate(new Date());
  
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <p style="margin: 0;">${superbill.clinicName}</p>
        <p style="margin: 0;">${superbill.clinicAddress}</p>
        <p style="margin: 0;">${superbill.clinicPhone}</p>
        <p style="margin: 0;">${superbill.clinicEmail}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>${today}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold;">RE: Request for Reimbursement — Chiropractic Services for ${superbill.patientName}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>Dear ${superbill.patientName.split(' ')[0]},</p>
        
        <p style="margin-top: 15px;">
          Enclosed with this letter, you will find a superbill summarizing the chiropractic care you received at our office, 
          along with individual invoices for your records. These documents are provided to assist you in submitting a 
          reimbursement claim to your insurance provider for out-of-network services.
        </p>
        
        <p style="margin-top: 15px;">Below is a simple set of steps to help guide you through the process:</p>
      </div>
      
      <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
        <ol style="padding-left: 25px; margin: 0;">
          <li style="margin-bottom: 15px;">
            <strong>Access Your Claim Form</strong><br/>
            Log in to your insurance provider's member portal or contact them directly to obtain their standard out-of-network reimbursement form.
          </li>
          
          <li style="margin-bottom: 15px;">
            <strong>Fill Out the Required Fields</strong><br/>
            Complete all necessary sections of the form, including your personal information and the dates of care.
          </li>
          
          <li style="margin-bottom: 15px;">
            <strong>Attach Supporting Documents</strong><br/>
            Include the following with your submission:<br/>
            <ul style="margin-top: 5px; padding-left: 20px;">
              <li>The superbill we've provided</li>
              <li>The attached invoices</li>
              <li>Your completed claim form</li>
            </ul>
          </li>
          
          <li style="margin-bottom: 15px;">
            <strong>Submit to Your Insurance Provider</strong><br/>
            Most providers accept claims by mail, fax, or through a member portal. Be sure to keep a copy for your records.
          </li>
          
          <li style="margin-bottom: 15px;">
            <strong>Track Your Claim</strong><br/>
            After processing, your provider will issue an Explanation of Benefits (EOB) and, if approved, send your reimbursement.
          </li>
        </ol>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>
          If your provider requests additional documentation, they're welcome to contact our clinic directly. 
          We're happy to assist if needed.
        </p>
        
        <p style="margin-top: 15px;">
          Thank you again for choosing ${superbill.clinicName}. We're honored to be part of your wellness journey.
        </p>
      </div>
      
      <div style="margin-top: 30px;">
        <p>Warmly,</p>
        <p style="margin-top: 30px;">The ${superbill.clinicName} Team</p>
      </div>
    </div>
  `;
}
