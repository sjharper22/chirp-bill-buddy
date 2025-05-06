
import { Superbill } from "@/types/superbill";
import { formatDate } from "./superbill-utils";

export function generateCoverSheetHtml(superbills: Superbill[], includeInvoiceNote: boolean = true): string {
  if (superbills.length === 0) return '';
  
  const firstSuperbill = superbills[0];
  const totalPatients = new Set(superbills.map(bill => bill.patientName)).size;
  const totalVisits = superbills.reduce((total, bill) => total + bill.visits.length, 0);
  const totalCharges = superbills.reduce((total, bill) => {
    return total + bill.visits.reduce((subtotal, visit) => subtotal + visit.fee, 0);
  }, 0);
  
  return `
    <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.5; border: 2px solid #ddd; padding: 20px; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
        <h1 style="margin: 0; font-size: 24px;">Insurance Submission Cover Sheet</h1>
        <p style="color: #666; margin-top: 5px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <h3 style="margin-bottom: 10px; font-size: 18px;">Submission Summary</h3>
        <div style="display: flex; justify-content: space-between;">
          <div style="text-align: center; flex: 1; padding: 10px;">
            <p style="color: #666; margin: 0; font-size: 14px;">Total Patients</p>
            <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${totalPatients}</p>
          </div>
          <div style="text-align: center; flex: 1; padding: 10px;">
            <p style="color: #666; margin: 0; font-size: 14px;">Total Visits</p>
            <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${totalVisits}</p>
          </div>
          <div style="text-align: center; flex: 1; padding: 10px;">
            <p style="color: #666; margin: 0; font-size: 14px;">Total Charges</p>
            <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">$${totalCharges.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <h3 style="margin-bottom: 10px; font-size: 18px;">Provider Information</h3>
        <div style="padding: 0 10px;">
          <p style="margin: 5px 0;"><span style="font-weight: 500; display: inline-block; width: 80px;">Provider:</span> ${firstSuperbill.providerName}</p>
          <p style="margin: 5px 0;"><span style="font-weight: 500; display: inline-block; width: 80px;">Clinic:</span> ${firstSuperbill.clinicName}</p>
          <p style="margin: 5px 0;"><span style="font-weight: 500; display: inline-block; width: 80px;">Address:</span> ${firstSuperbill.clinicAddress}</p>
          <p style="margin: 5px 0;"><span style="font-weight: 500; display: inline-block; width: 80px;">Phone:</span> ${firstSuperbill.clinicPhone}</p>
          <p style="margin: 5px 0;"><span style="font-weight: 500; display: inline-block; width: 80px;">Email:</span> ${firstSuperbill.clinicEmail}</p>
          <p style="margin: 5px 0;"><span style="font-weight: 500; display: inline-block; width: 80px;">EIN:</span> ${firstSuperbill.ein}</p>
          <p style="margin: 5px 0;"><span style="font-weight: 500; display: inline-block; width: 80px;">NPI #:</span> ${firstSuperbill.npi}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px; font-size: 18px;">Submission Instructions</h3>
        <div style="background: #f7f7f7; padding: 15px; border-radius: 6px;">
          <ol style="padding-left: 20px; margin: 0;">
            <li style="margin-bottom: 8px;">Submit all attached superbills to your insurance provider.</li>
            <li style="margin-bottom: 8px;">Include this cover sheet with your submission.</li>
            <li style="margin-bottom: 8px;">Keep copies of all documents for your records.</li>
            <li style="margin-bottom: 8px;">Contact your insurance provider if you have any questions about the submission process.</li>
            <li style="margin-bottom: 0;">For billing questions, contact the provider using the information above.</li>
          </ol>
        </div>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px;">
        <h3 style="margin-bottom: 10px; font-size: 18px;">Included Patients</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px;">
          ${superbills.map(bill => `
            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
              <p style="font-weight: 500; margin: 5px 0;">${bill.patientName}</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">DOB: ${new Date(bill.patientDob).toLocaleDateString()}</p>
              <p style="font-size: 14px; margin: 5px 0;">
                Visits: ${bill.visits.length}, 
                Total: $${bill.visits.reduce((t, v) => t + v.fee, 0).toFixed(2)}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
