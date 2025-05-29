
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
    
    <p>Enclosed you will find a superbill summarizing your chiropractic care at our office. This document is provided to assist you in submitting a reimbursement claim to your insurance provider for out-of-network services.</p>
    
    <p>Below are the steps to help guide you through the reimbursement process:</p>
    
    <p><strong>1. Access Your Claim Form</strong><br>
    Log in to your insurance provider's member portal or contact them directly to obtain their out-of-network reimbursement form.</p>
    
    <p><strong>2. Complete the Form</strong><br>
    Fill out all required sections, including your personal information and dates of care.</p>
    
    <p><strong>3. Attach Documentation</strong><br>
    Include the following with your submission:</p>
    <ul>
      <li>The enclosed superbill</li>
      <li>Your completed claim form</li>
      <li>Any additional requested documentation</li>
    </ul>
    
    <p><strong>4. Submit Your Claim</strong><br>
    Most providers accept claims by mail, fax, or through their member portal. Keep copies for your records.</p>
    
    <p><strong>5. Track Your Claim</strong><br>
    After processing, your provider will issue an Explanation of Benefits (EOB) and send your reimbursement if approved.</p>
    
    <p>Thank you for choosing ${superbill.clinicName}. We're honored to be part of your wellness journey.</p>
    
    <p>Warmly,</p>
    
    <p>The ${superbill.clinicName} Team</p>
  `;
}
