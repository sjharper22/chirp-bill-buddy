
export function generatePrintStyles(): string {
  return `
    @media print {
      body { 
        margin: 0; 
        padding: 8px;
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
        padding: 8px 12px;
        background: white !important;
        border-bottom: 2px solid #ccc;
        text-align: left;
        page-break-inside: avoid;
      }
      .header-content {
        padding: 0;
        max-width: 100%;
        flex-direction: column;
        align-items: flex-start;
        margin: 0;
      }
      .logo-section {
        margin-bottom: 6px;
        text-align: left;
        width: 100%;
      }
      .clinic-logo {
        height: 22px;
        width: auto;
      }
      .title-section {
        text-align: left;
        margin-bottom: 6px;
      }
      .title-section h1 {
        font-size: 20px;
        margin: 0 0 3px 0;
        color: #000;
        font-weight: 700;
        letter-spacing: 1.5px;
      }
      .clinic-info {
        font-size: 9px;
        color: #666;
        line-height: 1.2;
        text-align: left;
      }
      .clinic-name {
        font-size: 11px;
        color: #333;
        font-weight: 600;
        margin-bottom: 2px;
      }
      .info-section {
        margin-bottom: 6px;
        gap: 15px;
        page-break-inside: avoid;
      }
      .info-title {
        font-size: 12px;
        margin-bottom: 3px;
        padding-bottom: 1px;
      }
      .info-block p {
        margin: 1px 0;
        font-size: 9px;
      }
      .services-section {
        margin-bottom: 6px;
        page-break-inside: avoid;
      }
      .services-title {
        font-size: 12px;
        margin-bottom: 3px;
        padding-bottom: 1px;
      }
      table {
        margin-bottom: 6px;
        font-size: 8px;
        page-break-inside: auto;
      }
      th, td {
        padding: 2px 1px;
        font-size: 8px;
      }
      th {
        font-size: 9px;
      }
      .total-row {
        font-size: 9px;
      }
      .notes {
        margin-bottom: 6px;
        min-height: 15px;
        padding: 4px;
        page-break-inside: avoid;
      }
      .notes-title {
        font-size: 12px;
        margin-bottom: 3px;
        padding-bottom: 1px;
      }
      .footer {
        margin-top: 6px;
        padding-top: 4px;
        font-size: 7px;
        page-break-inside: avoid;
      }
      p {
        margin: 0 0 1px 0;
      }
      ol li, ul li {
        margin-bottom: 1px;
      }
      /* Improved page break handling */
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
      /* Force content to stay within page boundaries */
      * {
        box-sizing: border-box;
      }
      /* Prevent content overflow */
      div, p, ul, ol, li {
        overflow: hidden;
        word-wrap: break-word;
      }
      /* Better orphan and widow control */
      p, div, h1, h2, h3, h4, h5, h6 {
        orphans: 2;
        widows: 2;
      }
      /* Reduce excessive spacing */
      div[style*="background-color: #f8f9fa"] {
        margin-bottom: 8px !important;
        padding: 8px !important;
      }
      div[style*="background-color: #fff3cd"] {
        margin-bottom: 8px !important;
        padding: 6px !important;
      }
    }
  `;
}
