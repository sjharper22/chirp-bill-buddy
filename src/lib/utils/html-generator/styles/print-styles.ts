
export function generatePrintStyles(): string {
  return `
    @media print {
      body { 
        margin: 0; 
        padding: 15px;
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
        margin-bottom: 12px;
        padding: 15px 20px;
        background: white !important;
        border-bottom: 2px solid #ccc;
        text-align: center;
      }
      .header-content {
        padding: 0;
        max-width: 100%;
        flex-direction: column;
        align-items: center;
      }
      .logo-section {
        margin-bottom: 10px;
        text-align: center;
        width: 100%;
      }
      .clinic-logo {
        height: 22px;
        width: auto;
      }
      .title-section {
        text-align: center;
        margin-bottom: 10px;
      }
      .title-section h1 {
        font-size: 22px;
        margin: 0 0 5px 0;
        color: #000;
        font-weight: 700;
        letter-spacing: 1.5px;
      }
      .clinic-info {
        font-size: 10px;
        color: #666;
        line-height: 1.3;
      }
      .clinic-name {
        font-size: 12px;
        color: #333;
        font-weight: 600;
        margin-bottom: 3px;
      }
      .info-section {
        margin-bottom: 8px;
        gap: 15px;
      }
      .info-title {
        font-size: 13px;
        margin-bottom: 6px;
        padding-bottom: 2px;
      }
      .info-block p {
        margin: 2px 0;
        font-size: 10px;
      }
      .services-section {
        margin-bottom: 8px;
      }
      .services-title {
        font-size: 13px;
        margin-bottom: 6px;
        padding-bottom: 2px;
      }
      table {
        margin-bottom: 8px;
        font-size: 9px;
      }
      th, td {
        padding: 3px 2px;
        font-size: 9px;
      }
      th {
        font-size: 10px;
      }
      .total-row {
        font-size: 10px;
      }
      .notes {
        margin-bottom: 8px;
        min-height: 30px;
        padding: 8px;
      }
      .notes-title {
        font-size: 13px;
        margin-bottom: 6px;
        padding-bottom: 2px;
      }
      .footer {
        margin-top: 8px;
        padding-top: 8px;
        font-size: 8px;
      }
      p {
        margin: 0 0 3px 0;
      }
      ol li, ul li {
        margin-bottom: 3px;
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
