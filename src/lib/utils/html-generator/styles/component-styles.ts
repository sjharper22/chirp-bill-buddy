
export function generateComponentStyles(): string {
  return `
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
