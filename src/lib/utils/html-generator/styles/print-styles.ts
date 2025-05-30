
export function generatePrintStyles(): string {
  return `
    @media print {
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
        print-color-adjust: exact;
      }
      
      body { 
        margin: 0; 
        padding: 15px;
        font-size: 11px;
        line-height: 1.4;
        font-family: Arial, sans-serif;
      }
      
      button { 
        display: none !important; 
      }
      
      .container {
        margin: 0;
        padding: 0;
        max-width: 100%;
        width: 100%;
      }
      
      /* Cover letter should always be on its own page */
      .cover-letter { 
        page-break-after: always;
        margin-bottom: 0;
        padding-bottom: 20px;
      }
      
      /* Header styling */
      .header {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #333;
      }
      
      .header h1 {
        font-size: 20px;
        margin: 0;
        text-align: center;
      }
      
      /* Info section styling */
      .info-section {
        margin-bottom: 15px;
        display: block;
        width: 100%;
      }
      
      .info-block {
        margin-bottom: 15px;
        width: 48%;
        display: inline-block;
        vertical-align: top;
      }
      
      .info-block:first-child {
        margin-right: 4%;
      }
      
      .info-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
        padding-bottom: 3px;
        border-bottom: 1px solid #ccc;
      }
      
      .info-block p {
        margin: 3px 0;
        font-size: 11px;
      }
      
      /* Services section */
      .services-section {
        margin-bottom: 20px;
        clear: both;
      }
      
      .services-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        padding-bottom: 3px;
        border-bottom: 1px solid #ccc;
      }
      
      /* Table styling - allow natural page breaks */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
        font-size: 10px;
      }
      
      th, td {
        border: 1px solid #333;
        padding: 4px 6px;
        font-size: 10px;
        text-align: left;
      }
      
      th {
        background-color: #f0f0f0;
        font-weight: bold;
        font-size: 11px;
      }
      
      .total-row {
        font-weight: bold;
        background-color: #f5f5f5;
        font-size: 11px;
      }
      
      /* Notes section */
      .notes {
        margin-bottom: 15px;
        padding: 10px;
        border: 1px solid #ccc;
        min-height: 30px;
        background-color: #fafafa;
      }
      
      .notes-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        padding-bottom: 3px;
        border-bottom: 1px solid #ccc;
      }
      
      /* Footer */
      .footer {
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid #ccc;
        font-size: 9px;
        text-align: center;
      }
      
      /* Paragraph and list styling */
      p {
        margin: 0 0 6px 0;
      }
      
      ol, ul {
        margin: 8px 0;
        padding-left: 20px;
      }
      
      ol li, ul li {
        margin-bottom: 6px;
        line-height: 1.3;
      }
      
      /* Specific styling for cover letter content */
      div[style*="background-color: #f8f9fa"] {
        background-color: #f8f9fa !important;
        padding: 15px !important;
        margin: 15px 0 !important;
        border-left: 3px solid #333 !important;
      }
      
      div[style*="background-color: #fff3cd"] {
        background-color: #fff3cd !important;
        padding: 15px !important;
        margin: 15px 0 !important;
        border: 1px solid #d4a574 !important;
      }
      
      /* Headings */
      h1, h2, h3, h4, h5, h6 {
        margin: 8px 0;
        line-height: 1.2;
      }
      
      h3 {
        font-size: 16px;
        margin-bottom: 10px;
      }
      
      h4 {
        font-size: 14px;
        margin-bottom: 8px;
      }
      
      /* Strong text */
      strong {
        font-weight: bold;
      }
      
      /* Ensure proper spacing */
      .page-break-after {
        page-break-after: always;
      }
      
      .no-page-break {
        display: block;
      }
      
      /* Remove any conflicting page break rules */
      .superbill-preview-content {
        display: block;
      }
    }
  `;
}
