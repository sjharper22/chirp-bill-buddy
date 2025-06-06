
import { Superbill } from "@/types/superbill";
import { formatCurrency } from "@/lib/utils/format-utils";

export function generatePatientReimbursementGuide(superbill: Superbill): string {
  const totalVisits = superbill.visits.length;
  const totalCharges = superbill.visits.reduce((sum, visit) => sum + visit.fee, 0);
  
  // Calculate date range for visits
  const visitDates = superbill.visits.map(visit => new Date(visit.date));
  const earliestDate = new Date(Math.min(...visitDates.map(d => d.getTime())));
  const latestDate = new Date(Math.max(...visitDates.map(d => d.getTime())));
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const visitDateRange = visitDates.length === 1 
    ? formatDate(earliestDate)
    : `${formatDate(earliestDate)} - ${formatDate(latestDate)}`;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 12px; max-width: 100%; margin: 0; padding: 20px;">
      <div style="margin-bottom: 30px;">
        <strong>RE: Superbill for Out-of-Network Reimbursement</strong><br/>
        <strong>Patient:</strong> ${superbill.patientName}<br/>
        <strong>Dates of Service:</strong> ${visitDateRange}<br/>
        <strong>Total Amount:</strong> ${formatCurrency(totalCharges)}
      </div>

      <div style="margin-bottom: 20px;">
        <p>Dear ${superbill.patientName.split(' ')[0]},</p>
        
        <p>We hope this message finds you well. Enclosed, please find your completed superbill documenting chiropractic services provided by Dr. ${superbill.providerName} at ${superbill.clinicName} from ${visitDateRange}, totaling ${formatCurrency(totalCharges)}.</p>
        
        <p>This superbill serves as official documentation to support your out-of-network insurance reimbursement request. To assist you in the submission process, we've outlined the recommended steps below:</p>
      </div>

      <div style="margin-bottom: 20px; padding-left: 20px;">
        <h4 style="margin-bottom: 10px;">📋 How to Submit Your Reimbursement Claim</h4>
        
        <ol style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;"><strong>Contact Your Insurance Provider:</strong> Call the customer service number on your insurance card or log into your online portal.</li>
          
          <li style="margin-bottom: 8px;"><strong>Request Out-of-Network Reimbursement Forms:</strong> Ask for the specific forms needed for out-of-network provider reimbursement.</li>
          
          <li style="margin-bottom: 8px;"><strong>Complete and Submit:</strong> Fill out the required forms and attach this superbill as supporting documentation.</li>
          
          <li style="margin-bottom: 8px;"><strong>Include Proof of Payment:</strong> Attach copies of your payment receipts to demonstrate services were paid for.</li>
          
          <li style="margin-bottom: 8px;"><strong>Follow Up:</strong> Contact your insurance company 2-3 weeks after submission to check on the status of your claim.</li>
        </ol>
      </div>

      <div style="margin-bottom: 20px;">
        <p><strong>Important Notes:</strong></p>
        <ul style="margin: 5px 0; padding-left: 20px;">
          <li>Reimbursement rates vary by insurance plan and may be subject to deductibles</li>
          <li>Keep copies of all submitted documentation for your records</li>
          <li>Some insurance companies may require additional forms or documentation</li>
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <p>If you have any questions about this superbill or need additional documentation, please don't hesitate to contact our office at ${superbill.clinicPhone} or ${superbill.clinicEmail}.</p>
        
        <p>We appreciate your trust in our care and wish you success with your reimbursement submission.</p>
      </div>

      <div style="margin-top: 30px;">
        <p>Sincerely,</p>
        <p style="margin-top: 40px;">
          Dr. ${superbill.providerName}<br/>
          ${superbill.clinicName}
        </p>
      </div>
    </div>
  `;
}
