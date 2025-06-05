
export function generateComponentStyles(): string {
  return `
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 25px 0;
      border-bottom: 1px solid #e5e7eb;
      background: #ffffff;
    }
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 800px;
      margin: 0 auto;
      padding: 0 40px;
    }
    .logo-section {
      flex: 0 0 auto;
    }
    .clinic-logo {
      height: 45px;
      width: auto;
      object-fit: contain;
    }
    .title-section {
      flex: 1;
      text-align: center;
      margin: 0 30px;
    }
    .title-section h1 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      letter-spacing: 0.5px;
    }
    .clinic-name {
      font-size: 12px;
      color: #6b7280;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.8px;
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
