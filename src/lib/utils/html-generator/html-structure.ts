
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "../superbill-utils";
import { commonCPTCodes } from "../medical-codes";

export function generatePatientInfoSection(superbill: Superbill, visitDates: number[]): string {
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  return `
    <div class="info-block">
      <div class="info-title">Patient Information</div>
      <p><strong>Name:</strong> ${superbill.patientName}</p>
      <p><strong>DOB:</strong> ${formatDate(superbill.patientDob)}</p>
      <p><strong>Date:</strong> ${formatDate(superbill.issueDate)}</p>
      ${visitDates.length > 0 ? `<p><strong>Visit Period:</strong> ${formatDate(earliestDate)} to ${formatDate(latestDate)}</p>` : ''}
    </div>
  `;
}

export function generateProviderInfoSection(superbill: Superbill): string {
  return `
    <div class="info-block">
      <div class="info-title">Provider Information</div>
      <p><strong>Provider:</strong> ${superbill.providerName}</p>
      <p>${superbill.clinicName}</p>
      <p>${superbill.clinicAddress}</p>
      <p><strong>Phone:</strong> ${superbill.clinicPhone}</p>
      <p><strong>Email:</strong> ${superbill.clinicEmail}</p>
      <p><strong>EIN:</strong> ${superbill.ein}</p>
      <p><strong>NPI #:</strong> ${superbill.npi}</p>
    </div>
  `;
}

export function generateServicesTable(superbill: Superbill): string {
  const totalFee = superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0);

  // Helper function to get CPT description
  const getCPTDescription = (code: string): string => {
    const cptCode = commonCPTCodes.find(cpt => cpt.value === code);
    return cptCode ? cptCode.label.split(' - ')[1] || cptCode.label : 'Service rendered';
  };

  // Create rows for each CPT code entry
  const serviceRows: Array<{
    visitId: string;
    date: Date;
    icdCodes: string[];
    cptCode: string;
    description: string;
    fee: number;
    isFirstRowForVisit: boolean;
    visitRowSpan: number;
  }> = [];

  superbill.visits.forEach(visit => {
    const cptEntries = visit.cptCodeEntries || [];
    
    // If no itemized entries, fall back to legacy cptCodes
    if (cptEntries.length === 0 && visit.cptCodes && visit.cptCodes.length > 0) {
      const feePerCode = visit.fee / visit.cptCodes.length;
      visit.cptCodes.forEach((code, index) => {
        serviceRows.push({
          visitId: visit.id,
          date: visit.date,
          icdCodes: visit.icdCodes || [],
          cptCode: code,
          description: getCPTDescription(code),
          fee: feePerCode,
          isFirstRowForVisit: index === 0,
          visitRowSpan: visit.cptCodes.length
        });
      });
    } else {
      // Use itemized entries
      cptEntries.forEach((entry, index) => {
        serviceRows.push({
          visitId: visit.id,
          date: visit.date,
          icdCodes: visit.icdCodes || [],
          cptCode: entry.code,
          description: entry.description,
          fee: entry.fee,
          isFirstRowForVisit: index === 0,
          visitRowSpan: cptEntries.length
        });
      });
    }
  });

  // Group by visit for subtotals
  const visitSubtotals = superbill.visits.map(visit => {
    const visitTotal = visit.cptCodeEntries?.reduce((sum, entry) => sum + entry.fee, 0) || visit.fee || 0;
    return { visitId: visit.id, total: visitTotal };
  });
  
  return `
    <table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="width: 15%; padding: 8px; font-size: 13px; word-wrap: break-word;">Date</th>
          <th style="width: 20%; padding: 8px; font-size: 13px; word-wrap: break-word;">ICD-10 Codes</th>
          <th style="width: 12%; padding: 8px; font-size: 13px; word-wrap: break-word;">CPT Code</th>
          <th style="width: 40%; padding: 8px; font-size: 13px; word-wrap: break-word;">Description</th>
          <th style="width: 13%; padding: 8px; font-size: 13px; text-align: right; word-wrap: break-word;">Fee</th>
        </tr>
      </thead>
      <tbody>
        ${serviceRows.map((row, index) => {
          const isLastRowForVisit = index === serviceRows.length - 1 || 
            serviceRows[index + 1]?.visitId !== row.visitId;
          
          return `
            <tr style="${index % 2 === 0 ? 'background-color: #ffffff;' : 'background-color: #f8f9fa;'}">
              ${row.isFirstRowForVisit ? `<td rowspan="${row.visitRowSpan}" style="border-right: 1px solid #dee2e6; padding: 6px; font-size: 12px; word-wrap: break-word; vertical-align: top;">${formatDate(row.date)}</td>` : ''}
              ${row.isFirstRowForVisit ? `<td rowspan="${row.visitRowSpan}" style="border-right: 1px solid #dee2e6; padding: 6px; font-size: 11px; word-wrap: break-word; vertical-align: top;">${row.icdCodes.join(', ')}</td>` : ''}
              <td style="padding: 6px; font-family: monospace; font-size: 12px; word-wrap: break-word; vertical-align: top;">${row.cptCode}</td>
              <td style="padding: 6px; font-size: 11px; line-height: 1.3; word-wrap: break-word; vertical-align: top;">${row.description}</td>
              <td style="padding: 6px; text-align: right; font-size: 12px; word-wrap: break-word; vertical-align: top;">${formatCurrency(row.fee)}</td>
            </tr>
            ${isLastRowForVisit ? `
              <tr style="background-color: #f1f3f4; border-bottom: 2px solid #dee2e6;">
                <td colspan="3"></td>
                <td style="padding: 4px 6px; text-align: right; font-weight: bold; font-size: 12px;">Visit Subtotal:</td>
                <td style="padding: 4px 6px; text-align: right; font-weight: bold; font-size: 12px;">${formatCurrency(visitSubtotals.find(v => v.visitId === row.visitId)?.total || 0)}</td>
              </tr>
            ` : ''}
          `;
        }).join("")}
        
        <tr style="border-top: 2px solid #333; background-color: rgba(59, 130, 246, 0.05);">
          <td colspan="4" style="padding: 8px 6px; text-align: right; font-weight: bold; font-size: 14px;">Grand Total:</td>
          <td style="padding: 8px 6px; text-align: right; font-weight: bold; font-size: 14px;">${formatCurrency(totalFee)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

export function generateNotesSection(superbill: Superbill): string {
  const hasNotes = superbill.visits.some(v => v.notes || (v.mainComplaints && v.mainComplaints.length > 0));
  
  const notesContent = hasNotes
    ? superbill.visits.map(visit => {
        const hasContent = visit.notes || (visit.mainComplaints && visit.mainComplaints.length > 0);
        if (!hasContent) return "";
        return `
          <p><strong>${formatDate(visit.date)}:</strong></p>
          ${visit.mainComplaints && visit.mainComplaints.length > 0 ? `<p><em>Main Complaints:</em> ${visit.mainComplaints.join(', ')}</p>` : ""}
          ${visit.notes ? `<p>${visit.notes}</p>` : ""}
          <br>
        `;
      }).join("")
    : "<p><em>No notes</em></p>";
    
  return `
    <div class="notes-title">Notes</div>
    <div class="notes">
      ${notesContent}
    </div>
  `;
}

export function generateFooter(): string {
  return `
    <div class="footer" style="margin-top: 40px; padding-top: 10px; border-top: 1px solid #ccc; font-size: 12px; text-align: center; page-break-inside: avoid;">
      <p>This is a superbill for services rendered. It is not a bill.</p>
      <p>Please submit to your insurance company for reimbursement.</p>
    </div>
  `;
}
