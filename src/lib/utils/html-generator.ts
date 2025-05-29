
import { Superbill } from "@/types/superbill";
import { formatDate, formatCurrency } from "./superbill-utils";

export function generatePrintableHTML(superbill: Superbill, coverLetterContent?: string): string {
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  let coverLetterHTML = '';
  if (coverLetterContent && coverLetterContent.trim() !== '') {
    coverLetterHTML = `
      <div class="cover-letter">
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
          margin: 0;
          padding: 40px;
          color: #333;
          line-height: 1.6;
          box-sizing: border-box;
        }
        .container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #eee;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          gap: 40px;
        }
        .info-block {
          width: 48%;
          flex: 1;
        }
        .info-title {
          font-weight: bold;
          margin-bottom: 15px;
          font-size: 18px;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .info-block p {
          margin: 8px 0;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px 8px;
          text-align: left;
          font-size: 13px;
        }
        th {
          background-color: #f8f9fa;
          font-weight: bold;
          font-size: 14px;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .total-row {
          font-weight: bold;
          background-color: #f2f2f2;
          font-size: 14px;
        }
        .notes {
          border: 1px solid #ddd;
          padding: 20px;
          min-height: 100px;
          margin-bottom: 30px;
          background-color: #fcfcfc;
        }
        .notes-title {
          font-weight: bold;
          margin-bottom: 15px;
          font-size: 18px;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }
        .cover-letter {
          margin-bottom: 40px;
          padding-bottom: 30px;
        }
        p {
          margin: 0 0 12px 0;
        }
        ol li, ul li {
          margin-bottom: 10px;
        }
        ol, ul {
          padding-left: 25px;
        }
        .services-section {
          margin-bottom: 30px;
        }
        .services-title {
          font-weight: bold;
          margin-bottom: 15px;
          font-size: 18px;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        @media print {
          body { 
            margin: 0; 
            padding: 20px;
          }
          button { 
            display: none; 
          }
          /* Remove all forced page breaks and spacing controls */
          .cover-letter { 
            page-break-after: always;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          /* Allow natural flow for all other elements */
          .header,
          .info-section,
          .services-section,
          .notes,
          .footer {
            page-break-inside: avoid;
            page-break-before: auto;
            page-break-after: auto;
          }
          /* Only break tables if absolutely necessary */
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          /* Remove orphan/widow controls that create spacing */
          p, div, h1, h2, h3, h4, h5, h6 {
            orphans: 1;
            widows: 1;
          }
          /* Minimize margins in print */
          .container {
            margin: 0;
            padding: 0;
          }
          .header {
            margin-bottom: 20px;
          }
          .info-section {
            margin-bottom: 20px;
          }
          .services-section {
            margin-bottom: 20px;
          }
          .notes {
            margin-bottom: 20px;
            min-height: auto;
          }
          .footer {
            margin-top: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${coverLetterHTML}
        
        <div class="header">
          <h1>SUPERBILL</h1>
        </div>
        
        <div class="info-section">
          <div class="info-block">
            <div class="info-title">Patient Information</div>
            <p><strong>Name:</strong> ${superbill.patientName}</p>
            <p><strong>DOB:</strong> ${formatDate(superbill.patientDob)}</p>
            <p><strong>Date:</strong> ${formatDate(superbill.issueDate)}</p>
            ${visitDates.length > 0 ? `<p><strong>Visit Period:</strong> ${formatDate(earliestDate)} to ${formatDate(latestDate)}</p>` : ''}
          </div>
          
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
        </div>
        
        <div class="services-section">
          <div class="services-title">Services</div>
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
                <td style="text-align: right;"><strong>${formatCurrency(superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0))}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="notes-title">Notes</div>
        <div class="notes">
          ${superbill.visits.some(v => v.notes || (v.mainComplaints && v.mainComplaints.length > 0)) 
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
