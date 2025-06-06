
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "../superbill-utils";

export function generateSuperbillHeader(superbill: Superbill): string {
  return `
    <div class="letterhead">
      <div class="logo-container">
        <img src="/lovable-uploads/a2e25411-48d4-4692-aa1c-835492f68f8f.png" alt="Collective Family Chiropractic Logo" class="clinic-logo" />
        <div>
          <div class="clinic-name">${superbill.clinicName}</div>
          <div class="small-text">Excellence in Chiropractic Care</div>
        </div>
      </div>
      
      <div class="title-container">
        <h1 class="document-title">SUPERBILL</h1>
        <div class="small-text">Healthcare Service Documentation</div>
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
    </div>
  `;
}

export function generatePatientInfoSection(superbill: Superbill, visitDates: number[]): string {
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  return `
    <div class="info-card">
      <div class="info-card-title">
        <span class="info-card-icon">👤</span>
        <span class="section-title">Patient Information</span>
      </div>
      <div class="body-text">
        <p><strong>Full Name:</strong> ${superbill.patientName}</p>
        <p><strong>Date of Birth:</strong> ${formatDate(superbill.patientDob)}</p>
        <p><strong>Superbill Date:</strong> ${formatDate(superbill.issueDate)}</p>
        ${visitDates.length > 0 ? `<p><strong>Service Period:</strong> ${formatDate(earliestDate)} to ${formatDate(latestDate)}</p>` : ''}
        ${visitDates.length > 0 ? `<p><strong>Total Visits:</strong> ${visitDates.length}</p>` : ''}
      </div>
    </div>
  `;
}

export function generateProviderInfoSection(superbill: Superbill): string {
  return `
    <div class="info-card">
      <div class="info-card-title">
        <span class="info-card-icon">👨‍⚕️</span>
        <span class="section-title">Provider Information</span>
      </div>
      <div class="body-text">
        <p><strong>Provider:</strong> ${superbill.providerName}</p>
        <p><strong>Practice:</strong> ${superbill.clinicName}</p>
        <p><strong>Address:</strong> ${superbill.clinicAddress}</p>
        <p><strong>Phone:</strong> ${superbill.clinicPhone}</p>
        <p><strong>Email:</strong> ${superbill.clinicEmail}</p>
        <p><strong>Tax ID (EIN):</strong> ${superbill.ein}</p>
        <p><strong>NPI Number:</strong> ${superbill.npi}</p>
      </div>
    </div>
  `;
}

export function generateServicesTable(superbill: Superbill): string {
  const totalFee = superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0);
  
  return `
    <div class="services-container">
      <div class="services-header">
        <span class="services-icon">🏥</span>
        <span class="section-title" style="color: #ffffff;">Healthcare Services Rendered</span>
      </div>
      <table class="professional-table">
        <thead>
          <tr>
            <th style="width: 15%;" class="table-header">Service Date</th>
            <th style="width: 30%;" class="table-header">Diagnosis Codes (ICD-10)</th>
            <th style="width: 30%;" class="table-header">Procedure Codes (CPT)</th>
            <th style="width: 25%; text-align: right;" class="table-header">Professional Fee</th>
          </tr>
        </thead>
        <tbody>
          ${superbill.visits.map((visit, index) => `
            <tr>
              <td class="table-cell">${formatDate(visit.date)}</td>
              <td class="table-cell">${visit.icdCodes.join(", ")}</td>
              <td class="table-cell">${visit.cptCodes.join(", ")}</td>
              <td class="table-cell" style="text-align: right; font-weight: 500;">${formatCurrency(visit.fee)}</td>
            </tr>
          `).join("")}
          <tr class="total-row">
            <td colspan="3" style="text-align: right;"><strong>TOTAL AMOUNT:</strong></td>
            <td style="text-align: right;"><strong>${formatCurrency(totalFee)}</strong></td>
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
          <div class="body-text" style="margin-bottom: 15px;">
            <p><strong>${formatDate(visit.date)}:</strong></p>
            ${visit.mainComplaints && visit.mainComplaints.length > 0 ? `<p><em>Chief Complaints:</em> ${visit.mainComplaints.join(', ')}</p>` : ""}
            ${visit.notes ? `<p><em>Clinical Notes:</em> ${visit.notes}</p>` : ""}
          </div>
        `;
      }).join("")
    : `<div class="body-text"><p><em>No clinical notes recorded for this billing period.</em></p></div>`;
    
  return `
    <div class="notes-container">
      <div class="notes-header">
        <span class="notes-icon">📝</span>
        <span class="section-title">Clinical Notes & Documentation</span>
      </div>
      ${notesContent}
    </div>
  `;
}

export function generateFooter(): string {
  return `
    <div class="professional-footer">
      <div class="footer-content">
        <div>
          <img src="/lovable-uploads/a2e25411-48d4-4692-aa1c-835492f68f8f.png" alt="Practice Logo" class="footer-logo" />
        </div>
        <div class="footer-text">
          <p><strong>IMPORTANT:</strong> This superbill is an official record of healthcare services provided.</p>
          <p>Submit this document to your insurance provider for out-of-network reimbursement consideration.</p>
          <p>Keep this document for your records. Contact our office if you need assistance with insurance claims.</p>
        </div>
        <div class="date-badge">
          Generated: ${new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  `;
}
