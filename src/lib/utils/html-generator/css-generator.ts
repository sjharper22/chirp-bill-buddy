
export function generatePrintableCSS(): string {
  return `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 40px;
      color: #333;
      line-height: 1.6;
      box-sizing: border-box;
    }
    .container {
      max-width: 100%;
      margin: 0 auto;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #eee;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
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
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    .cover-letter {
      margin-bottom: 40px;
      padding-bottom: 30px;
    }
    p {
      margin: 0 0 12px 0;
    }
    ol li, ul li {
      margin-bottom: 10px;
    }
    ol, ul {
      padding-left: 25px;
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
    @media print {
      body { 
        margin: 0; 
        padding: 10px;
        font-size: 11px;
        line-height: 1.3;
      }
      button { 
        display: none; 
      }
      .cover-letter { 
        page-break-after: always;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .container {
        margin: 0;
        padding: 0;
        max-width: 100%;
      }
      .header {
        margin-bottom: 10px;
        padding-bottom: 8px;
      }
      .header h1 {
        font-size: 20px;
        margin: 0;
      }
      .info-section {
        margin-bottom: 10px;
        gap: 15px;
      }
      .info-title {
        font-size: 14px;
        margin-bottom: 8px;
        padding-bottom: 3px;
      }
      .info-block p {
        margin: 2px 0;
        font-size: 11px;
      }
      .services-section {
        margin-bottom: 10px;
      }
      .services-title {
        font-size: 14px;
        margin-bottom: 8px;
        padding-bottom: 3px;
      }
      table {
        margin-bottom: 10px;
        font-size: 10px;
      }
      th, td {
        padding: 4px 3px;
        font-size: 10px;
      }
      th {
        font-size: 11px;
      }
      .total-row {
        font-size: 11px;
      }
      .notes {
        margin-bottom: 10px;
        min-height: 40px;
        padding: 10px;
      }
      .notes-title {
        font-size: 14px;
        margin-bottom: 8px;
        padding-bottom: 3px;
      }
      .footer {
        margin-top: 10px;
        padding-top: 10px;
        font-size: 9px;
      }
      p {
        margin: 0 0 4px 0;
      }
      ol li, ul li {
        margin-bottom: 4px;
      }
      /* Optimize page breaks to reduce white space */
      .header,
      .info-section,
      .services-section {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      .notes,
      .footer {
        page-break-inside: avoid;
      }
      table {
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      thead {
        display: table-header-group;
      }
      /* Minimize orphans and widows */
      p, div, h1, h2, h3, h4, h5, h6 {
        orphans: 1;
        widows: 1;
      }
    }
  `;
}
