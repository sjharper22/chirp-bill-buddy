
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export interface PDFRenderOptions {
  html: string;
  scale?: number;
  timeout?: number;
}

export class PDFRenderer {
  private static readonly A4_WIDTH_INCHES = 8.27;
  private static readonly PAGE_WIDTH_MM = 210;
  private static readonly PAGE_HEIGHT_MM = 297;
  private static readonly MARGIN_MM = 12.7;

  async renderSection(options: PDFRenderOptions): Promise<HTMLCanvasElement> {
    const { html, scale = 2, timeout = 1000 } = options;
    
    const container = document.createElement("div");
    container.innerHTML = html;
    this.setupContainer(container);
    document.body.appendChild(container);
    
    try {
      await this.waitForImages(container);
      await new Promise(resolve => setTimeout(resolve, timeout));
      
      const canvas = await html2canvas(container, {
        scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: container.offsetWidth,
        height: container.offsetHeight,
        windowWidth: container.offsetWidth,
        windowHeight: container.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.body.querySelector('div');
          if (clonedContainer) {
            this.setupClonedContainer(clonedContainer as HTMLElement);
          }
        }
      });
      
      return canvas;
    } finally {
      document.body.removeChild(container);
    }
  }

  addCanvasToPDF(pdf: jsPDF, canvas: HTMLCanvasElement, isFirstPage: boolean = false): void {
    const printableWidth = PDFRenderer.PAGE_WIDTH_MM - (PDFRenderer.MARGIN_MM * 2);
    const printableHeight = PDFRenderer.PAGE_HEIGHT_MM - (PDFRenderer.MARGIN_MM * 2);
    
    const imgWidth = printableWidth;
    const imgHeight = (canvas.height * printableWidth) / canvas.width;
    
    if (!isFirstPage) {
      pdf.addPage();
    }
    
    if (imgHeight <= printableHeight) {
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        PDFRenderer.MARGIN_MM, 
        PDFRenderer.MARGIN_MM, 
        imgWidth, 
        imgHeight, 
        '', 
        'FAST'
      );
      return;
    }
    
    this.splitCanvasAcrossPages(pdf, canvas, printableWidth, printableHeight);
  }

  private setupContainer(container: HTMLElement): void {
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = `${PDFRenderer.A4_WIDTH_INCHES}in`;
    container.style.maxWidth = `${PDFRenderer.A4_WIDTH_INCHES}in`;
    container.style.backgroundColor = "#ffffff";
    container.style.padding = "0.5in";
    container.style.boxSizing = "border-box";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "12px";
    container.style.lineHeight = "1.4";
    container.style.overflow = "visible";
  }

  private setupClonedContainer(container: HTMLElement): void {
    container.style.position = 'static';
    container.style.transform = 'none';
    container.style.width = `${PDFRenderer.A4_WIDTH_INCHES}in`;
    container.style.maxWidth = `${PDFRenderer.A4_WIDTH_INCHES}in`;
    container.style.margin = '0';
    container.style.padding = '0.5in';
    container.style.boxSizing = 'border-box';
    container.style.overflow = 'visible';
  }

  private async waitForImages(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll('img');
    const imageLoadPromises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
          setTimeout(() => resolve(true), 3000);
        }
      });
    });
    
    await Promise.all(imageLoadPromises);
  }

  private splitCanvasAcrossPages(
    pdf: jsPDF, 
    canvas: HTMLCanvasElement, 
    printableWidth: number, 
    printableHeight: number
  ): void {
    const imgWidth = printableWidth;
    const imgHeight = (canvas.height * printableWidth) / canvas.width;
    const pagesNeeded = Math.ceil(imgHeight / printableHeight);
    
    for (let page = 0; page < pagesNeeded; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      
      const sourceY = (canvas.height / pagesNeeded) * page;
      const sourceHeight = Math.min(canvas.height / pagesNeeded, canvas.height - sourceY);
      
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );
        
        const pageImgHeight = (sourceHeight * printableWidth) / canvas.width;
        pdf.addImage(
          pageCanvas.toDataURL('image/png'), 
          'PNG', 
          PDFRenderer.MARGIN_MM, 
          PDFRenderer.MARGIN_MM, 
          imgWidth, 
          pageImgHeight, 
          '', 
          'FAST'
        );
      }
    }
  }
}
