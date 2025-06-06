
import { jsPDF } from "jspdf";

export function addCanvasToPDF(pdf: jsPDF, canvas: HTMLCanvasElement, margin: number, contentWidth: number): void {
  const pageHeight = 297; // A4 height in mm
  const contentHeight = pageHeight - (margin * 2);
  
  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;
  
  // If content fits on one page
  if (imgHeight <= contentHeight) {
    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', margin, margin, imgWidth, imgHeight);
    return;
  }
  
  // Split content across multiple pages with better precision
  const pixelsPerMM = canvas.height / imgHeight;
  const contentHeightInPixels = contentHeight * pixelsPerMM;
  
  let currentY = 0;
  let pageCount = 0;
  
  while (currentY < canvas.height) {
    if (pageCount > 0) {
      pdf.addPage();
    }
    
    const remainingHeight = canvas.height - currentY;
    const sectionHeight = Math.min(contentHeightInPixels, remainingHeight);
    
    // Create canvas for this page section
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sectionHeight;
    
    const ctx = pageCanvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw the section
      ctx.drawImage(
        canvas,
        0, currentY, canvas.width, sectionHeight,
        0, 0, canvas.width, sectionHeight
      );
      
      const pageImgHeight = (sectionHeight * contentWidth) / canvas.width;
      pdf.addImage(pageCanvas.toDataURL('image/png', 1.0), 'PNG', margin, margin, imgWidth, pageImgHeight);
    }
    
    currentY += sectionHeight;
    pageCount++;
  }
}
