
export function generateHeaderStyles(): string {
  return `
    /* Document structure */
    .document-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      page-break-after: always;
    }
    
    .document-page:last-child {
      page-break-after: auto;
    }
    
    /* Header styles */
    .document-header {
      width: 100%;
      padding: 12px 0;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .header-divider {
      width: 100%;
      height: 1px;
      background-color: #ddd;
      margin-top: 8px;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .header-logo {
      max-height: 40px;
      max-width: 65px;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    
    .header-clinic-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .clinic-name {
      font-weight: bold;
      font-size: 12px;
      color: #333;
      line-height: 1.2;
    }
    
    .clinic-contact {
      font-size: 10px;
      color: #666;
      line-height: 1.2;
    }
    
    .header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
    }
    
    .document-info {
      text-align: right;
    }
    
    .document-type {
      font-weight: bold;
      font-size: 14px;
      color: #333;
      line-height: 1.2;
    }
    
    .patient-name {
      font-size: 12px;
      color: #333;
      margin: 1px 0;
      line-height: 1.2;
    }
    
    .document-date {
      font-size: 10px;
      color: #666;
      line-height: 1.2;
    }
    
    .page-number {
      font-size: 10px;
      color: #666;
      font-weight: bold;
      line-height: 1.2;
    }
    
    /* Page content */
    .page-content {
      flex: 1;
      padding-top: 10px;
    }
    
    .superbill-title {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .superbill-title h2 {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 0;
    }
    
    /* Print-specific styles */
    @media print {
      .document-header {
        padding: 8px 0 !important;
        margin-bottom: 15px !important;
      }
      
      .header-logo {
        max-height: 35px !important;
        max-width: 60px !important;
      }
      
      .clinic-name {
        font-size: 11px !important;
      }
      
      .clinic-contact {
        font-size: 9px !important;
      }
      
      .document-type {
        font-size: 12px !important;
      }
      
      .patient-name {
        font-size: 11px !important;
      }
      
      .document-date, .page-number {
        font-size: 9px !important;
      }
      
      .superbill-title h2 {
        font-size: 16px !important;
      }
    }
    
    /* PDF-optimized styles */
    .pdf-optimized .document-header {
      padding: 8px 0 !important;
      margin-bottom: 15px !important;
    }
    
    .pdf-optimized .header-logo {
      max-height: 35px !important;
      max-width: 60px !important;
    }
    
    .pdf-optimized .clinic-name {
      font-size: 11px !important;
    }
    
    .pdf-optimized .clinic-contact {
      font-size: 9px !important;
    }
    
    .pdf-optimized .document-type {
      font-size: 12px !important;
    }
    
    .pdf-optimized .patient-name {
      font-size: 11px !important;
    }
    
    .pdf-optimized .document-date,
    .pdf-optimized .page-number {
      font-size: 9px !important;
    }
    
    .pdf-optimized .superbill-title h2 {
      font-size: 16px !important;
    }
  `;
}
