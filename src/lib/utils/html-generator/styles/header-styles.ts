
export function generateHeaderStyles(): string {
  return `
    /* CSS @page rules for print headers */
    @page {
      size: A4;
      margin: 0.75in 0.5in 0.5in 0.5in;
      @top-left {
        content: element(running-header-left);
        vertical-align: middle;
      }
      @top-center {
        content: element(running-header-center);
        vertical-align: middle;
      }
      @top-right {
        content: element(running-header-right);
        vertical-align: middle;
      }
    }
    
    @page :first {
      @top-left { content: none; }
      @top-center { content: none; }
      @top-right { content: none; }
    }
    
    /* Running header elements */
    .running-header {
      position: running(page-header);
      display: none;
    }
    
    .running-header-left {
      position: running(running-header-left);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .running-header-center {
      position: running(running-header-center);
      text-align: center;
    }
    
    .running-header-right {
      position: running(running-header-right);
      text-align: right;
    }
    
    /* Standard page header for first page and fallback */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 2px solid #eee;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .header-logo, .running-logo {
      max-height: 50px;
      max-width: 80px;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    
    .header-clinic-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .clinic-name {
      font-weight: bold;
      font-size: 14px;
      color: #333;
    }
    
    .clinic-contact {
      font-size: 12px;
      color: #666;
    }
    
    .header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }
    
    .document-info {
      text-align: right;
    }
    
    .document-type {
      font-weight: bold;
      font-size: 16px;
      color: #333;
    }
    
    .patient-name {
      font-size: 14px;
      color: #333;
      margin: 2px 0;
    }
    
    .document-date {
      font-size: 12px;
      color: #666;
    }
    
    .page-number {
      font-size: 12px;
      color: #666;
      font-weight: bold;
    }
    
    /* Print-specific header styles */
    @media print {
      .page-header {
        padding: 8px 0 !important;
        margin-bottom: 15px !important;
        border-bottom: 1px solid #ccc !important;
      }
      
      .header-logo, .running-logo {
        max-height: 40px !important;
        max-width: 65px !important;
      }
      
      .clinic-name {
        font-size: 12px !important;
      }
      
      .clinic-contact {
        font-size: 10px !important;
      }
      
      .document-type {
        font-size: 14px !important;
      }
      
      .patient-name {
        font-size: 12px !important;
      }
      
      .document-date, .page-number {
        font-size: 10px !important;
      }
      
      /* Running header styles for browsers that support it */
      .running-header-left,
      .running-header-center, 
      .running-header-right {
        font-size: 10px;
        color: #333;
      }
      
      .running-clinic, .running-document-type {
        font-weight: bold;
      }
      
      .running-patient, .running-date {
        color: #666;
      }
    }
    
    /* PDF-optimized header styles */
    .pdf-optimized .page-header {
      padding: 8px 0 !important;
      margin-bottom: 15px !important;
      border-bottom: 1px solid #ccc !important;
    }
    
    .pdf-optimized .header-logo,
    .pdf-optimized .running-logo {
      max-height: 40px !important;
      max-width: 65px !important;
    }
    
    .pdf-optimized .clinic-name {
      font-size: 12px !important;
    }
    
    .pdf-optimized .clinic-contact {
      font-size: 10px !important;
    }
    
    .pdf-optimized .document-type {
      font-size: 14px !important;
    }
    
    .pdf-optimized .patient-name {
      font-size: 12px !important;
    }
    
    .pdf-optimized .document-date,
    .pdf-optimized .page-number {
      font-size: 10px !important;
    }
  `;
}
