
export function generateBaseStyles(): string {
  return `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 25px;
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
  `;
}
