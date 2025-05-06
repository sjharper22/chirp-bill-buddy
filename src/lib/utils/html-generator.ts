
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "./superbill-utils";

export function generatePrintableHTML(superbill: Superbill, coverLetterContent?: string): string {
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  let coverLetterHTML = '';
  if (coverLetterContent) {
    coverLetterHTML = `
      <div class="cover-letter" style="margin-bottom: 30px; page-break-after: always;">
        ${coverLetterContent}
      </div>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Superbill - ${superbill.patientName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
          line-height: 1.5;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .info-block {
          width: 48%;
        }
        .info-title {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .total-row {
          font-weight: bold;
          background-color: #f2f2f2;
        }
        .notes {
          border: 1px solid #ddd;
          padding: 15px;
          min-height: 80px;
          margin-bottom: 20px;
          background-color: #fcfcfc;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        .cover-letter {
          margin-bottom: 30px;
          border-bottom: 1px dashed #ccc;
          padding-bottom: 20px;
        }
        p {
          margin: 0 0 10px 0;
        }
        ol li, ul li {
          margin-bottom: 8px;
        }
        ol, ul {
          padding-left: 25px;
        }
        @media print {
          body { margin: 0; padding: 20px; }
          button { display: none; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${coverLetterHTML}
        
        <div class="header page-break">
          <h1>SUPERBILL</h1>
        </div>
        
        <div class="info-section">
          <div class="info-block">
            <div class="info-title">Patient Information</div>
            <p style="margin: 5px 0;">Name: ${superbill.patientName}</p>
            <p style="margin: 5px 0;">DOB: ${formatDate(superbill.patientDob)}</p>
            <p style="margin: 5px 0;">Date: ${formatDate(superbill.issueDate)}</p>
            ${visitDates.length > 0 ? `<p style="margin: 5px 0;">Visit Period: ${formatDate(earliestDate)} to ${formatDate(latestDate)}</p>` : ''}
          </div>
          
          <div class="info-block">
            <div class="info-title">Provider Information</div>
            <p style="margin: 5px 0;">Provider: ${superbill.providerName}</p>
            <p style="margin: 5px 0;">${superbill.clinicName}</p>
            <p style="margin: 5px 0;">${superbill.clinicAddress}</p>
            <p style="margin: 5px 0;">Phone: ${superbill.clinicPhone}</p>
            <p style="margin: 5px 0;">Email: ${superbill.clinicEmail}</p>
            <p style="margin: 5px 0;">EIN: ${superbill.ein}</p>
            <p style="margin: 5px 0;">NPI #: ${superbill.npi}</p>
          </div>
        </div>
        
        <div class="info-title">Services</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>ICD-10 Codes</th>
              <th>CPT Codes</th>
              <th style="text-align: right;">Fee</th>
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
              <td colspan="3" style="text-align: right;">Total:</td>
              <td style="text-align: right;">${formatCurrency(superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0))}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="info-title">Notes</div>
        <div class="notes">
          ${superbill.visits.some(v => v.notes || (v.mainComplaints && v.mainComplaints.length > 0)) 
            ? superbill.visits.map(visit => {
                const hasContent = visit.notes || (visit.mainComplaints && visit.mainComplaints.length > 0);
                if (!hasContent) return "";
                return `
                  <p><strong>${formatDate(visit.date)}:</strong></p>
                  ${visit.mainComplaints && visit.mainComplaints.length > 0 ? `<p><em>Main Complaints:</em> ${visit.mainComplaints.join(', ')}</p>` : ""}
                  ${visit.notes ? `<p>${visit.notes}</p>` : ""}
                `;
              }).join("")
            : "<p><em>No notes</em></p>"
          }
        </div>
        
        <div class="footer">
          <p>This is a superbill for services rendered. It is not a bill.</p>
          <p>Please submit to your insurance company for reimbursement.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
