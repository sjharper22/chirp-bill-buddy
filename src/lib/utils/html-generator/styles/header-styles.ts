
export const headerStyles = `
  .document-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  
  .header-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .header-logo {
    flex-shrink: 0;
  }
  
  .logo-image {
    height: 32px;
    width: auto;
    object-fit: contain;
  }
  
  .header-clinic-info {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  
  .clinic-name {
    font-size: 18px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 2px;
  }
  
  .clinic-contact {
    font-size: 12px;
    color: #666;
  }
  
  .header-right {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
  
  .document-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .document-type {
    font-size: 16px;
    font-weight: bold;
    color: #1a1a1a;
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
    font-size: 11px;
    color: #888;
    font-weight: normal;
  }
  
  .header-divider {
    border-bottom: 1px solid #ddd;
    margin-top: 10px;
  }
`;
