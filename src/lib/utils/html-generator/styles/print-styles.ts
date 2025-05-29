
export function generatePrintStyles(): string {
  return `
    @media print {
      body { 
        margin: 0; 
        padding: 10px;
        font-size: 11px;
        line-height: 1.3;
      }
      button { 
        display: none; 
      }
      .cover-letter { 
        page-break-after: always;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .container {
        margin: 0;
        padding: 0;
        max-width: 100%;
      }
      .header {
        margin-bottom: 10px;
        padding-bottom: 8px;
      }
      .header h1 {
        font-size: 20px;
        margin: 0;
      }
      .info-section {
        margin-bottom: 10px;
        gap: 15px;
      }
      .info-title {
        font-size: 14px;
        margin-bottom: 8px;
        padding-bottom: 3px;
      }
      .info-block p {
        margin: 2px 0;
        font-size: 11px;
      }
      .services-section {
        margin-bottom: 10px;
      }
      .services-title {
        font-size: 14px;
        margin-bottom: 8px;
        padding-bottom: 3px;
      }
      table {
        margin-bottom: 10px;
        font-size: 10px;
      }
      th, td {
        padding: 4px 3px;
        font-size: 10px;
      }
      th {
        font-size: 11px;
      }
      .total-row {
        font-size: 11px;
      }
      .notes {
        margin-bottom: 10px;
        min-height: 40px;
        padding: 10px;
      }
      .notes-title {
        font-size: 14px;
        margin-bottom: 8px;
        padding-bottom: 3px;
      }
      .footer {
        margin-top: 10px;
        padding-top: 10px;
        font-size: 9px;
      }
      p {
        margin: 0 0 4px 0;
      }
      ol li, ul li {
        margin-bottom: 4px;
      }
      /* Optimize page breaks to reduce white space */
      .header,
      .info-section,
      .services-section {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      .notes,
      .footer {
        page-break-inside: avoid;
      }
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
      /* Minimize orphans and widows */
      p, div, h1, h2, h3, h4, h5, h6 {
        orphans: 1;
        widows: 1;
      }
    }
  `;
}
