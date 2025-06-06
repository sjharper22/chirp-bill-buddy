
export function generateProfessionalLayoutStyles(): string {
  return `
    .professional-document {
      max-width: 8.5in;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    
    .letterhead {
      background: linear-gradient(135deg, #f8fffe 0%, #ffffff 100%);
      border-bottom: 3px solid #2d5a3d;
      padding: 25px 30px;
      margin-bottom: 0;
      position: relative;
    }
    
    .letterhead::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #2d5a3d 50%, transparent 100%);
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .clinic-logo {
      height: 35px;
      width: auto;
      margin-right: 15px;
    }
    
    .title-container {
      text-align: left;
      margin-bottom: 12px;
    }
    
    .contact-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #666666;
    }
    
    .contact-icon {
      width: 14px;
      height: 14px;
      margin-right: 8px;
      color: #2d5a3d;
    }
    
    .document-body {
      padding: 30px;
      background: #ffffff;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
      padding: 20px;
      background: #f8fffe;
      border: 1px solid #e5f3f0;
      border-radius: 8px;
    }
    
    .info-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .info-card-title {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #2d5a3d;
    }
    
    .info-card-icon {
      width: 18px;
      height: 18px;
      margin-right: 8px;
      color: #2d5a3d;
    }
    
    .services-container {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 25px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .services-header {
      background: linear-gradient(135deg, #2d5a3d 0%, #3a6b4a 100%);
      color: #ffffff;
      padding: 15px 20px;
      display: flex;
      align-items: center;
    }
    
    .services-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    
    .professional-table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
      font-size: 12px;
    }
    
    .professional-table th {
      background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%);
      color: #2d5a3d;
      padding: 12px 15px;
      text-align: left;
      border-bottom: 2px solid #2d5a3d;
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.3px;
    }
    
    .professional-table td {
      padding: 12px 15px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }
    
    .professional-table tr:nth-child(even) {
      background: #fafcfb;
    }
    
    .professional-table tr:hover {
      background: #f0f9f7;
    }
    
    .total-row {
      background: linear-gradient(135deg, #2d5a3d 0%, #3a6b4a 100%) !important;
      color: #ffffff !important;
      font-weight: 600;
      font-size: 14px;
    }
    
    .total-row td {
      border-bottom: none !important;
      padding: 15px;
    }
    
    .notes-container {
      background: #f8fffe;
      border: 1px solid #e5f3f0;
      border-left: 4px solid #2d5a3d;
      border-radius: 6px;
      padding: 20px;
      margin-bottom: 25px;
      min-height: 120px;
    }
    
    .notes-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      color: #2d5a3d;
    }
    
    .notes-icon {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    
    .professional-footer {
      background: linear-gradient(135deg, #f8fffe 0%, #ffffff 100%);
      border-top: 2px solid #2d5a3d;
      padding: 20px 30px;
      text-align: center;
      margin-top: 30px;
      position: relative;
    }
    
    .professional-footer::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #2d5a3d 50%, transparent 100%);
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .footer-logo {
      height: 25px;
      width: auto;
      opacity: 0.7;
    }
    
    .footer-text {
      font-size: 11px;
      color: #666666;
      line-height: 1.4;
    }
    
    .date-badge {
      background: #2d5a3d;
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.3px;
    }
  `;
}
