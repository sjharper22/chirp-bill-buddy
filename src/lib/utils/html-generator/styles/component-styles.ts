
export function generateComponentStyles(): string {
  return `
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px 0;
      border-bottom: 3px solid #2563eb;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .logo-section {
      flex: 0 0 auto;
    }
    .clinic-logo {
      height: 80px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    .title-section {
      flex: 1;
      text-align: center;
      margin-left: 20px;
    }
    .title-section h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: bold;
      color: #1e40af;
      letter-spacing: 2px;
    }
    .clinic-name {
      font-size: 16px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      gap: 40px;
    }
    .info-block {
      width: 48%;
      flex: 1;
    }
    .info-title {
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 18px;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    .info-block p {
      margin: 8px 0;
      font-size: 14px;
    }
    .services-section {
      margin-bottom: 30px;
    }
    .services-title {
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 18px;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px 8px;
      text-align: left;
      font-size: 13px;
    }
    th {
      background-color: #f8f9fa;
      font-weight: bold;
      font-size: 14px;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .total-row {
      font-weight: bold;
      background-color: #f2f2f2;
      font-size: 14px;
    }
    .notes {
      border: 1px solid #ddd;
      padding: 20px;
      min-height: 100px;
      margin-bottom: 30px;
      background-color: #fcfcfc;
    }
    .notes-title {
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 18px;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
  `;
}
