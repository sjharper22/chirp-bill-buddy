
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "../superbill-utils";

export function generateSuperbillHeader(superbill: Superbill): string {
  return `
    <div style="background: linear-gradient(135deg, #f8fffe 0%, #ffffff 100%); border-bottom: 3px solid #2d5a3d; padding: 25px 30px; margin-bottom: 0;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <img src="/lovable-uploads/a2e25411-48d4-4692-aa1c-835492f68f8f.png" alt="Collective Family Chiropractic Logo" style="height: 35px; width: auto; margin-right: 15px;" />
        <div>
          <div style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 18px; color: #2d5a3d;">${superbill.clinicName}</div>
          <div style="font-size: 12px; color: #666666;">Excellence in Chiropractic Care</div>
        </div>
      </div>
      
      <div style="text-align: left; margin-bottom: 12px;">
        <h1 style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 28px; letter-spacing: 1.5px; color: #2d5a3d; text-transform: uppercase; margin: 0;">SUPERBILL</h1>
        <div style="font-size: 12px; color: #666666;">Healthcare Service Documentation</div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; font-size: 12px; color: #666666;">
          <span style="margin-right: 8px;">📍</span>
          ${superbill.clinicAddress}
        </div>
        <div style="display: flex; align-items: center; font-size: 12px; color: #666666;">
          <span style="margin-right: 8px;">📞</span>
          ${superbill.clinicPhone}
        </div>
        <div style="display: flex; align-items: center; font-size: 12px; color: #666666;">
          <span style="margin-right: 8px;">✉️</span>
          ${superbill.clinicEmail}
        </div>
        <div style="display: flex; align-items: center; font-size: 12px; color: #666666;">
          <span style="margin-right: 8px;">🏥</span>
          NPI: ${superbill.npi} | EIN: ${superbill.ein}
        </div>
      </div>
    </div>
  `;
}

export function generatePatientInfoSection(superbill: Superbill, visitDates: number[]): string {
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  return `
    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
      <div style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #2d5a3d;">
        <span style="margin-right: 8px;">👤</span>
        <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 16px; color: #2d5a3d; letter-spacing: 0.5px; text-transform: uppercase;">Patient Information</span>
      </div>
      <div style="font-family: 'Open Sans', sans-serif; font-weight: 400; font-size: 14px; line-height: 1.6; color: #333333;">
        <p style="margin: 8px 0;"><strong>Full Name:</strong> ${superbill.patientName}</p>
        <p style="margin: 8px 0;"><strong>Date of Birth:</strong> ${formatDate(superbill.patientDob)}</p>
        <p style="margin: 8px 0;"><strong>Superbill Date:</strong> ${formatDate(superbill.issueDate)}</p>
        ${visitDates.length > 0 ? `<p style="margin: 8px 0;"><strong>Service Period:</strong> ${formatDate(earliestDate)} to ${formatDate(latestDate)}</p>` : ''}
        ${visitDates.length > 0 ? `<p style="margin: 8px 0;"><strong>Total Visits:</strong> ${visitDates.length}</p>` : ''}
      </div>
    </div>
  `;
}

export function generateProviderInfoSection(superbill: Superbill): string {
  return `
    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
      <div style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #2d5a3d;">
        <span style="margin-right: 8px;">👨‍⚕️</span>
        <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 16px; color: #2d5a3d; letter-spacing: 0.5px; text-transform: uppercase;">Provider Information</span>
      </div>
      <div style="font-family: 'Open Sans', sans-serif; font-weight: 400; font-size: 14px; line-height: 1.6; color: #333333;">
        <p style="margin: 8px 0;"><strong>Provider:</strong> ${superbill.providerName}</p>
        <p style="margin: 8px 0;"><strong>Practice:</strong> ${superbill.clinicName}</p>
        <p style="margin: 8px 0;"><strong>Address:</strong> ${superbill.clinicAddress}</p>
        <p style="margin: 8px 0;"><strong>Phone:</strong> ${superbill.clinicPhone}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> ${superbill.clinicEmail}</p>
        <p style="margin: 8px 0;"><strong>Tax ID (EIN):</strong> ${superbill.ein}</p>
        <p style="margin: 8px 0;"><strong>NPI Number:</strong> ${superbill.npi}</p>
      </div>
    </div>
  `;
}

export function generateServicesTable(superbill: Superbill): string {
  const totalFee = superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0);
  
  return `
    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #2d5a3d 0%, #3a6b4a 100%); color: #ffffff; padding: 15px 20px; display: flex; align-items: center;">
        <span style="margin-right: 10px;">🏥</span>
        <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 16px; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">Healthcare Services Rendered</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; background: #ffffff; font-size: 12px;">
        <thead>
          <tr>
            <th style="background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%); color: #2d5a3d; padding: 12px 15px; text-align: left; border-bottom: 2px solid #2d5a3d; font-weight: 600; font-size: 13px; letter-spacing: 0.3px; width: 15%;">Service Date</th>
            <th style="background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%); color: #2d5a3d; padding: 12px 15px; text-align: left; border-bottom: 2px solid #2d5a3d; font-weight: 600; font-size: 13px; letter-spacing: 0.3px; width: 30%;">Diagnosis Codes (ICD-10)</th>
            <th style="background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%); color: #2d5a3d; padding: 12px 15px; text-align: left; border-bottom: 2px solid #2d5a3d; font-weight: 600; font-size: 13px; letter-spacing: 0.3px; width: 30%;">Procedure Codes (CPT)</th>
            <th style="background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%); color: #2d5a3d; padding: 12px 15px; text-align: right; border-bottom: 2px solid #2d5a3d; font-weight: 600; font-size: 13px; letter-spacing: 0.3px; width: 25%;">Professional Fee</th>
          </tr>
        </thead>
        <tbody>
          ${superbill.visits.map((visit, index) => `
            <tr style="${index % 2 === 0 ? 'background: #fafcfb;' : 'background: #ffffff;'}">
              <td style="font-family: 'Open Sans', sans-serif; font-weight: 400; font-size: 12px; color: #333333; padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">${formatDate(visit.date)}</td>
              <td style="font-family: 'Open Sans', sans-serif; font-weight: 400; font-size: 12px; color: #333333; padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">${visit.icdCodes.join(", ")}</td>
              <td style="font-family: 'Open Sans', sans-serif; font-weight: 400; font-size: 12px; color: #333333; padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">${visit.cptCodes.join(", ")}</td>
              <td style="font-family: 'Open Sans', sans-serif; font-weight: 500; font-size: 12px; color: #333333; padding: 12px 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(visit.fee)}</td>
            </tr>
          `).join("")}
          <tr style="background: linear-gradient(135deg, #2d5a3d 0%, #3a6b4a 100%); color: #ffffff; font-weight: 600; font-size: 14px;">
            <td colspan="3" style="text-align: right; padding: 15px; border-bottom: none; color: #ffffff;"><strong>TOTAL AMOUNT:</strong></td>
            <td style="text-align: right; padding: 15px; border-bottom: none; color: #ffffff;"><strong>${formatCurrency(totalFee)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

export function generateNotesSection(superbill: Superbill): string {
  const hasNotes = superbill.visits.some(v => v.notes || (v.mainComplaints && v.mainComplaints.length > 0));
  
  const notesContent = hasNotes
    ? superbill.visits.map(visit => {
        const hasContent = visit.notes || (visit.mainComplaints && visit.mainComplaints.length > 0);
        if (!hasContent) return "";
        return `
          <div style="font-family: 'Open Sans', sans-serif; font-weight: 400; font-size: 14px; line-height: 1.6; color: #333333; margin-bottom: 15px;">
            <p style="margin: 8px 0;"><strong>${formatDate(visit.date)}:</strong></p>
            ${visit.mainComplaints && visit.mainComplaints.length > 0 ? `<p style="margin: 8px 0;"><em>Chief Complaints:</em> ${visit.mainComplaints.join(', ')}</p>` : ""}
            ${visit.notes ? `<p style="margin: 8px 0;"><em>Clinical Notes:</em> ${visit.notes}</p>` : ""}
          </div>
        `;
      }).join("")
    : `<div style="font-family: 'Open Sans', sans-serif; font-weight: 400; font-size: 14px; line-height: 1.6; color: #333333;"><p style="margin: 8px 0;"><em>No clinical notes recorded for this billing period.</em></p></div>`;
    
  return `
    <div style="background: #f8fffe; border: 1px solid #e5f3f0; border-left: 4px solid #2d5a3d; border-radius: 6px; padding: 20px; margin-bottom: 25px; min-height: 120px;">
      <div style="display: flex; align-items: center; margin-bottom: 15px; color: #2d5a3d;">
        <span style="margin-right: 8px;">📝</span>
        <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 16px; color: #2d5a3d; letter-spacing: 0.5px; text-transform: uppercase;">Clinical Notes & Documentation</span>
      </div>
      ${notesContent}
    </div>
  `;
}

export function generateFooter(): string {
  return `
    <div style="background: linear-gradient(135deg, #f8fffe 0%, #ffffff 100%); border-top: 2px solid #2d5a3d; padding: 20px 30px; text-align: center; margin-top: 30px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
        <div>
          <img src="/lovable-uploads/a2e25411-48d4-4692-aa1c-835492f68f8f.png" alt="Practice Logo" style="height: 25px; width: auto; opacity: 0.7;" />
        </div>
        <div style="font-size: 11px; color: #666666; line-height: 1.4;">
          <p style="margin: 4px 0;"><strong>IMPORTANT:</strong> This superbill is an official record of healthcare services provided.</p>
          <p style="margin: 4px 0;">Submit this document to your insurance provider for out-of-network reimbursement consideration.</p>
          <p style="margin: 4px 0;">Keep this document for your records. Contact our office if you need assistance with insurance claims.</p>
        </div>
        <div style="background: #2d5a3d; color: #ffffff; padding: 4px 12px; border-radius: 15px; font-size: 11px; font-weight: 500; letter-spacing: 0.3px;">
          Generated: ${new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  `;
}
