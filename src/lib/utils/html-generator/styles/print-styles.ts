
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
        page-break-inside: avoid;
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
        page-break-inside: avoid;
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
        page-break-inside: avoid;
      }
      p {
        margin: 0 0 4px 0;
      }
      ol li, ul li {
        margin-bottom: 4px;
      }
      
      /* Critical: Prevent content duplication and ensure proper page breaks */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        box-sizing: border-box;
      }
      
      /* Ensure step-by-step instructions section doesn't break awkwardly */
      div[style*="background-color: #f8f9fa"] {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 20px !important;
      }
      
      /* Ensure important notes section doesn't duplicate */
      div[style*="background-color: #fff3cd"] {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 20px !important;
      }
      
      /* Signature block should stay together */
      div[style*="margin-bottom: 40px"] {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Better page break management */
      .header,
      .info-section,
      .services-section {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      
      /* Prevent orphaned content */
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        break-after: avoid;
        orphans: 3;
        widows: 3;
      }
      
      /* Ensure lists don't break poorly */
      ul, ol {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      /* Better handling of background colors and borders in print */
      div[style*="background-color"] {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
        print-color-adjust: exact;
      }
      
      /* Force page breaks where needed */
      .page-break-before {
        page-break-before: always !important;
        break-before: page !important;
      }
      
      .page-break-after {
        page-break-after: always !important;
        break-after: page !important;
      }
      
      .no-page-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  `;
}
