
export function generatePrintOptimizationStyles(): string {
  return `
    @media print {
      @page {
        size: A4;
        margin: 0.5in;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-size: 12px;
        line-height: 1.4;
        color: #000000 !important;
        background: #ffffff !important;
      }
      
      * {
        box-sizing: border-box;
        color-adjust: exact;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .professional-document {
        box-shadow: none;
        max-width: 100%;
        margin: 0;
      }
      
      .letterhead {
        background: #f8fffe !important;
        border-bottom: 2px solid #2d5a3d !important;
        page-break-inside: avoid;
        padding: 15px 20px;
        margin-bottom: 15px;
      }
      
      .document-title {
        font-size: 22px;
        margin: 8px 0;
      }
      
      .clinic-name {
        font-size: 16px;
      }
      
      .document-body {
        padding: 0 20px;
      }
      
      .info-grid {
        padding: 15px;
        margin-bottom: 20px;
        page-break-inside: avoid;
      }
      
      .info-card {
        padding: 15px;
        break-inside: avoid;
      }
      
      .services-container {
        page-break-inside: avoid;
        margin-bottom: 20px;
      }
      
      .services-header {
        background: #2d5a3d !important;
        color: #ffffff !important;
        padding: 10px 15px;
      }
      
      .professional-table {
        page-break-inside: auto;
      }
      
      .professional-table th {
        background: #f0f9f7 !important;
        color: #2d5a3d !important;
        font-size: 11px;
        padding: 8px 12px;
      }
      
      .professional-table td {
        font-size: 10px;
        padding: 8px 12px;
      }
      
      .professional-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      
      .total-row {
        background: #2d5a3d !important;
        color: #ffffff !important;
        font-size: 12px;
      }
      
      .notes-container {
        background: #f8fffe !important;
        border: 1px solid #2d5a3d !important;
        border-left: 3px solid #2d5a3d !important;
        page-break-inside: avoid;
        padding: 15px;
        margin-bottom: 20px;
        min-height: 80px;
      }
      
      .professional-footer {
        background: #f8fffe !important;
        border-top: 2px solid #2d5a3d !important;
        padding: 15px 20px;
        page-break-inside: avoid;
        margin-top: 20px;
      }
      
      .cover-letter {
        page-break-after: always;
        margin-bottom: 0;
        padding-bottom: 20px;
      }
      
      /* Hide buttons and interactive elements */
      button, .no-print {
        display: none !important;
      }
      
      /* Ensure proper text rendering */
      p, div, span, td, th {
        orphans: 2;
        widows: 2;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      /* Improve spacing for print */
      .contact-info-grid {
        gap: 15px;
        margin-top: 10px;
        padding-top: 10px;
      }
      
      .contact-item {
        font-size: 10px;
      }
      
      .footer-content {
        gap: 10px;
      }
      
      .footer-text {
        font-size: 9px;
      }
      
      /* Ensure logos print correctly */
      img {
        max-width: 100% !important;
        height: auto !important;
      }
      
      .clinic-logo {
        height: 28px !important;
      }
      
      .footer-logo {
        height: 20px !important;
      }
    }
  `;
}
