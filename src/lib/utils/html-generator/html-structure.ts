
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "../superbill-utils";

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
  
  return `
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Date</th>
          <th style="width: 30%;">ICD-10 Codes</th>
          <th style="width: 30%;">CPT Codes</th>
          <th style="width: 15%; text-align: right;">Fee</th>
        </tr>
      </thead>
      <tbody>
        ${superbill.visits.map((visit, index) => `
          <tr>
            <td>${formatDate(visit.date)}</td>
            <td>${visit.icdCodes.join(", ")}</td>
            <td>${visit.cptCodes.join(", ")}</td>
            <td style="text-align: right;">${formatCurrency(visit.fee)}</td>
          </tr>
        `).join("")}
        <tr class="total-row">
          <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
          <td style="text-align: right;"><strong>${formatCurrency(totalFee)}</strong></td>
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
