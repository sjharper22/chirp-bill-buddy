
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
    <p>Dear ${superbill.patientName},</p>
    
    <p>Enclosed with this letter, you will find a superbill summarizing the chiropractic care you received at our office, along with individual invoices for your records. These documents are provided to assist you in submitting a reimbursement claim to your insurance provider for out-of-network services.</p>
    
    <p>Below is a simple set of steps to help guide you through the process:</p>
    
    <p><strong>1. Access Your Claim Form</strong><br>
    Log in to your insurance provider's member portal or contact them directly to obtain their standard out-of-network reimbursement form.</p>
    
    <p><strong>2. Fill Out the Required Fields</strong><br>
    Complete all necessary sections of the form, including your personal information and the dates of care.</p>
    
    <p><strong>3. Attach Supporting Documents</strong><br>
    Include the following with your submission:</p>
    <ul>
      <li>The superbill we've provided</li>
      <li>The attached invoices</li>
      <li>Your completed claim form</li>
    </ul>
    
    <p><strong>4. Submit to Your Insurance Provider</strong><br>
    Most providers accept claims by mail, fax, or through a member portal. Be sure to keep a copy for your records.</p>
    
    <p><strong>5. Track Your Claim</strong><br>
    After processing, your provider will issue an Explanation of Benefits (EOB) and, if approved, send your reimbursement.</p>
    
    <p>Thank you again for choosing ${superbill.clinicName}. We're honored to be part of your wellness journey.</p>
    
    <p>Warmly,</p>
    
    <p>The ${superbill.clinicName} Team</p>
  `;
}
