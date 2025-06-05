
export function generateComponentStyles(): string {
  return `
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px 30px;
      border-bottom: 2px solid #e5e7eb;
      background: #ffffff;
    }
    .header-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-width: 800px;
      margin: 0 auto;
    }
    .logo-section {
      margin-bottom: 15px;
      text-align: center;
      width: 100%;
    }
    .clinic-logo {
      height: 30px;
      width: auto;
      object-fit: contain;
    }
    .title-section {
      text-align: center;
      margin-bottom: 12px;
    }
    .title-section h1 {
      margin: 0 0 6px 0;
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .clinic-info {
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
      line-height: 1.4;
    }
    .clinic-name {
      font-size: 16px;
      color: #374151;
      font-weight: 600;
      margin-bottom: 4px;
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
