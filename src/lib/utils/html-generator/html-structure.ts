
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "../superbill-utils";

export function generateSuperbillHeader(superbill: Superbill): string {
  return `
    <div style="background: linear-gradient(135deg, #f8fffe 0%, #ffffff 100%); border-bottom: 3px solid #2d5a3d; padding: 25px; margin-bottom: 0; box-sizing: border-box;">
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="/lovable-uploads/a2e25411-48d4-4692-aa1c-835492f68f8f.png" alt="Collective Family Chiropractic Logo" style="height: 40px; width: auto; margin-right: 15px;" />
        <div>
          <div style="font-family: 'Arial', sans-serif; font-weight: bold; font-size: 20px; color: #2d5a3d; margin-bottom: 4px;">${superbill.clinicName}</div>
          <div style="font-size: 14px; color: #666666;">Excellence in Chiropractic Care</div>
        </div>
      </div>
      
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-family: 'Arial', sans-serif; font-weight: bold; font-size: 32px; letter-spacing: 2px; color: #2d5a3d; text-transform: uppercase; margin: 0 0 8px 0;">SUPERBILL</h1>
        <div style="font-size: 14px; color: #666666;">Healthcare Service Documentation</div>
      </div>
      
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; font-size: 13px; color: #666666;">
          <span style="margin-right: 8px;">📍</span>
          ${superbill.clinicAddress}
        </div>
        <div style="display: flex; align-items: center; font-size: 13px; color: #666666;">
          <span style="margin-right: 8px;">📞</span>
          ${superbill.clinicPhone}
        </div>
        <div style="display: flex; align-items: center; font-size: 13px; color: #666666;">
          <span style="margin-right: 8px;">✉️</span>
          ${superbill.clinicEmail}
        </div>
        <div style="display: flex; align-items: center; font-size: 13px; color: #666666;">
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
    <div style="flex: 1; background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
      <div style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #2d5a3d;">
        <span style="margin-right: 8px; font-size: 18px;">👤</span>
        <span style="font-family: 'Arial', sans-serif; font-weight: bold; font-size: 16px; color: #2d5a3d; letter-spacing: 0.5px; text-transform: uppercase;">Patient Information</span>
      </div>
      <div style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.8; color: #333333;">
        <div style="margin-bottom: 10px;"><strong>Full Name:</strong> ${superbill.patientName}</div>
        <div style="margin-bottom: 10px;"><strong>Date of Birth:</strong> ${formatDate(superbill.patientDob)}</div>
        <div style="margin-bottom: 10px;"><strong>Superbill Date:</strong> ${formatDate(superbill.issueDate)}</div>
        ${visitDates.length > 0 ? `<div style="margin-bottom: 10px;"><strong>Service Period:</strong> ${formatDate(earliestDate)} to ${formatDate(latestDate)}</div>` : ''}
        ${visitDates.length > 0 ? `<div style="margin-bottom: 10px;"><strong>Total Visits:</strong> ${visitDates.length}</div>` : ''}
      </div>
    </div>
  `;
}

export function generateProviderInfoSection(superbill: Superbill): string {
  return `
    <div style="flex: 1; background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
      <div style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #2d5a3d;">
        <span style="margin-right: 8px; font-size: 18px;">👨‍⚕️</span>
        <span style="font-family: 'Arial', sans-serif; font-weight: bold; font-size: 16px; color: #2d5a3d; letter-spacing: 0.5px; text-transform: uppercase;">Provider Information</span>
      </div>
      <div style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.8; color: #333333;">
        <div style="margin-bottom: 10px;"><strong>Provider:</strong> ${superbill.providerName}</div>
        <div style="margin-bottom: 10px;"><strong>Practice:</strong> ${superbill.clinicName}</div>
        <div style="margin-bottom: 10px;"><strong>Address:</strong> ${superbill.clinicAddress}</div>
        <div style="margin-bottom: 10px;"><strong>Phone:</strong> ${superbill.clinicPhone}</div>
        <div style="margin-bottom: 10px;"><strong>Email:</strong> ${superbill.clinicEmail}</div>
        <div style="margin-bottom: 10px;"><strong>Tax ID (EIN):</strong> ${superbill.ein}</div>
        <div style="margin-bottom: 10px;"><strong>NPI Number:</strong> ${superbill.npi}</div>
      </div>
    </div>
  `;
}

export function generateServicesTable(superbill: Superbill): string {
  const totalFee = superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0);
  
  return `
    <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 25px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);">
      <div style="background: linear-gradient(135deg, #2d5a3d 0%, #3a6b4a 100%); color: #ffffff; padding: 18px 25px; display: flex; align-items: center;">
        <span style="margin-right: 12px; font-size: 20px;">🏥</span>
        <span style="font-family: 'Arial', sans-serif; font-weight: bold; font-size: 18px; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">Healthcare Services Rendered</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; background: #ffffff; font-size: 14px;">
        <thead>
          <tr>
            <th style="background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%); color: #2d5a3d; padding: 15px 20px; text-align: left; border-bottom: 2px solid #2d5a3d; font-weight: bold; font-size: 14px; letter-spacing: 0.3px; width: 18%;">Service Date</th>
            <th style="background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%); color: #2d5a3d; padding: 15px 20px; text-align: left; border-bottom: 2px solid #2d5a3d; font-weight: bold; font-size: 14px; letter-spacing: 0.3px; width: 32%;">Diagnosis Codes (ICD-10)</th>
            <th style="background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%); color: #2d5a3d; padding: 15px 20px; text-align: left; border-bottom: 2px solid #2d5a3d; font-weight: bold; font-size: 14px; letter-spacing: 0.3px; width: 32%;">Procedure Codes (CPT)</th>
            <th style="background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%); color: #2d5a3d; padding: 15px 20px; text-align: right; border-bottom: 2px solid #2d5a3d; font-weight: bold; font-size: 14px; letter-spacing: 0.3px; width: 18%;">Professional Fee</th>
          </tr>
        </thead>
        <tbody>
          ${superbill.visits.map((visit, index) => `
            <tr style="${index % 2 === 0 ? 'background: #fafcfb;' : 'background: #ffffff;'}">
              <td style="font-family: 'Arial', sans-serif; font-size: 13px; color: #333333; padding: 15px 20px; border-bottom: 1px solid #e5e7eb;">${formatDate(visit.date)}</td>
              <td style="font-family: 'Arial', sans-serif; font-size: 13px; color: #333333; padding: 15px 20px; border-bottom: 1px solid #e5e7eb;">${visit.icdCodes.join(", ")}</td>
              <td style="font-family: 'Arial', sans-serif; font-size: 13px; color: #333333; padding: 15px 20px; border-bottom: 1px solid #e5e7eb;">${visit.cptCodes.join(", ")}</td>
              <td style="font-family: 'Arial', sans-serif; font-weight: 600; font-size: 13px; color: #333333; padding: 15px 20px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(visit.fee)}</td>
            </tr>
          `).join("")}
          <tr style="background: linear-gradient(135deg, #2d5a3d 0%, #3a6b4a 100%); color: #ffffff; font-weight: bold; font-size: 16px;">
            <td colspan="3" style="text-align: right; padding: 18px 20px; border-bottom: none; color: #ffffff;"><strong>TOTAL AMOUNT:</strong></td>
            <td style="text-align: right; padding: 18px 20px; border-bottom: none; color: #ffffff;"><strong>${formatCurrency(totalFee)}</strong></td>
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
          <div style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; color: #333333; margin-bottom: 15px;">
            <div style="margin-bottom: 8px;"><strong>${formatDate(visit.date)}:</strong></div>
            ${visit.mainComplaints && visit.mainComplaints.length > 0 ? `<div style="margin-bottom: 8px;"><em>Chief Complaints:</em> ${visit.mainComplaints.join(', ')}</div>` : ""}
            ${visit.notes ? `<div style="margin-bottom: 8px;"><em>Clinical Notes:</em> ${visit.notes}</div>` : ""}
          </div>
        `;
      }).join("")
    : `<div style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; color: #333333;"><div style="margin-bottom: 8px;"><em>No clinical notes recorded for this billing period.</em></div></div>`;
    
  return `
    <div style="background: #f8fffe; border: 2px solid #e5f3f0; border-left: 4px solid #2d5a3d; border-radius: 8px; padding: 25px; margin-bottom: 25px; min-height: 120px;">
      <div style="display: flex; align-items: center; margin-bottom: 18px; color: #2d5a3d;">
        <span style="margin-right: 10px; font-size: 18px;">📝</span>
        <span style="font-family: 'Arial', sans-serif; font-weight: bold; font-size: 16px; color: #2d5a3d; letter-spacing: 0.5px; text-transform: uppercase;">Clinical Notes & Documentation</span>
      </div>
      ${notesContent}
    </div>
  `;
}

export function generateFooter(): string {
  return `
    <div style="background: linear-gradient(135deg, #f8fffe 0%, #ffffff 100%); border-top: 2px solid #2d5a3d; padding: 25px; text-align: center; margin-top: 30px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
        <div>
          <img src="/lovable-uploads/a2e25411-48d4-4692-aa1c-835492f68f8f.png" alt="Practice Logo" style="height: 30px; width: auto; opacity: 0.7;" />
        </div>
        <div style="font-size: 12px; color: #666666; line-height: 1.5; text-align: center; flex: 1;">
          <div style="margin-bottom: 6px;"><strong>IMPORTANT:</strong> This superbill is an official record of healthcare services provided.</div>
          <div style="margin-bottom: 6px;">Submit this document to your insurance provider for out-of-network reimbursement consideration.</div>
          <div style="margin-bottom: 6px;">Keep this document for your records. Contact our office if you need assistance with insurance claims.</div>
        </div>
        <div style="background: #2d5a3d; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 0.3px;">
          Generated: ${new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  `;
}
