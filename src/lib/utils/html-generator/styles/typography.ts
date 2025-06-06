
export function generateTypographyStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap');
    
    body {
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      letter-spacing: -0.025em;
      color: #1a1a1a;
      margin: 0;
    }
    
    .document-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 28px;
      letter-spacing: 1.5px;
      color: #2d5a3d;
      text-transform: uppercase;
    }
    
    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 16px;
      color: #2d5a3d;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    
    .clinic-name {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 18px;
      color: #2d5a3d;
    }
    
    .body-text {
      font-family: 'Open Sans', sans-serif;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.6;
      color: #333333;
    }
    
    .small-text {
      font-family: 'Open Sans', sans-serif;
      font-weight: 400;
      font-size: 12px;
      line-height: 1.4;
      color: #666666;
    }
    
    .table-header {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 13px;
      color: #2d5a3d;
      letter-spacing: 0.3px;
    }
    
    .table-cell {
      font-family: 'Open Sans', sans-serif;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
    }
  `;
}
