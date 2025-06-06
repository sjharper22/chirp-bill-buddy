
export function generatePrintStyles(): string {
  return `
    @media print {
      body { 
        margin: 0 !important; 
        padding: 10px !important;
        font-size: 11px !important;
        line-height: 1.3 !important;
        min-height: auto !important;
      }
      button { 
        display: none !important; 
      }
      .cover-letter { 
        page-break-after: always !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
      }
      .container {
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        min-height: auto !important;
      }
      .document-content {
        margin-top: 10px !important;
      }
      .info-section {
        margin-bottom: 10px !important;
        gap: 10px !important;
      }
      .info-title {
        font-size: 12px !important;
        margin-bottom: 5px !important;
        padding-bottom: 2px !important;
      }
      .info-block p {
        margin: 1px 0 !important;
        font-size: 10px !important;
      }
      .services-section {
        margin-bottom: 10px !important;
      }
      .services-title {
        font-size: 12px !important;
        margin-bottom: 5px !important;
        padding-bottom: 2px !important;
      }
      table {
        margin-bottom: 10px !important;
        font-size: 9px !important;
      }
      th, td {
        padding: 2px 1px !important;
        font-size: 9px !important;
      }
      th {
        font-size: 10px !important;
      }
      .total-row {
        font-size: 10px !important;
      }
      .notes {
        margin-bottom: 10px !important;
        min-height: 40px !important;
        padding: 5px !important;
      }
      .notes-title {
        font-size: 12px !important;
        margin-bottom: 5px !important;
        padding-bottom: 2px !important;
      }
      .footer {
        margin-top: 10px !important;
        padding-top: 5px !important;
        font-size: 8px !important;
      }
      p {
        margin: 0 0 2px 0 !important;
      }
      ol li, ul li {
        margin-bottom: 2px !important;
      }
      /* Optimize page breaks to reduce white space */
      .page-header,
      .info-section,
      .services-section {
        page-break-inside: avoid !important;
        page-break-after: auto !important;
      }
      .notes,
      .footer {
        page-break-inside: avoid !important;
      }
      table {
        page-break-inside: auto !important;
      }
      tr {
        page-break-inside: avoid !important;
        page-break-after: auto !important;
      }
      thead {
        display: table-header-group !important;
      }
      /* Minimize orphans and widows to reduce white space */
      p, div, h1, h2, h3, h4, h5, h6 {
        orphans: 2 !important;
        widows: 2 !important;
      }
    }
    
    /* Styles that apply to both screen and print for PDF generation */
    .pdf-optimized {
      font-size: 11px !important;
      line-height: 1.3 !important;
      margin: 0 !important;
      padding: 10px !important;
      min-height: auto !important;
    }
    
    .pdf-optimized .container {
      margin: 0 !important;
      padding: 0 !important;
      max-width: 100% !important;
      min-height: auto !important;
    }
    
    .pdf-optimized .document-content {
      margin-top: 10px !important;
    }
    
    .pdf-optimized .info-section {
      margin-bottom: 10px !important;
      gap: 10px !important;
    }
    
    .pdf-optimized .info-title {
      font-size: 12px !important;
      margin-bottom: 5px !important;
      padding-bottom: 2px !important;
    }
    
    .pdf-optimized .info-block p {
      margin: 1px 0 !important;
      font-size: 10px !important;
    }
    
    .pdf-optimized .services-section {
      margin-bottom: 10px !important;
    }
    
    .pdf-optimized .services-title {
      font-size: 12px !important;
      margin-bottom: 5px !important;
      padding-bottom: 2px !important;
    }
    
    .pdf-optimized table {
      margin-bottom: 10px !important;
      font-size: 9px !important;
    }
    
    .pdf-optimized th, .pdf-optimized td {
      padding: 2px 1px !important;
      font-size: 9px !important;
    }
    
    .pdf-optimized th {
      font-size: 10px !important;
    }
    
    .pdf-optimized .total-row {
      font-size: 10px !important;
    }
    
    .pdf-optimized .notes {
      margin-bottom: 10px !important;
      min-height: 40px !important;
      padding: 5px !important;
    }
    
    .pdf-optimized .notes-title {
      font-size: 12px !important;
      margin-bottom: 5px !important;
      padding-bottom: 2px !important;
    }
    
    .pdf-optimized .footer {
      margin-top: 10px !important;
      padding-top: 5px !important;
      font-size: 8px !important;
    }
    
    .pdf-optimized p {
      margin: 0 0 2px 0 !important;
    }
  `;
}
