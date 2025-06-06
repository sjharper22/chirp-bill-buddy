
import { jsPDF } from "jspdf";
import { Superbill } from "@/types/superbill";
import { generatePrintableHTML } from "@/lib/utils/html-generator";
import { formatDate } from "@/lib/utils/superbill-utils";
import { PDFRenderer } from "./pdf-renderer";

export interface PDFGenerationOptions {
  superbill: Superbill;
  coverLetterContent?: string;
  onProgress?: (message: string) => void;
}

export class PDFGenerator {
  private renderer = new PDFRenderer();

  async generatePDF(options: PDFGenerationOptions): Promise<Blob> {
    const { superbill, coverLetterContent, onProgress } = options;
    
    onProgress?.("Generating document HTML...");
    const { coverLetterHTML, superbillHTML } = generatePrintableHTML(superbill, coverLetterContent);
    
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    let isFirstPage = true;
    
    // Render cover letter if content exists
    if (coverLetterHTML && coverLetterHTML.trim() !== '') {
      onProgress?.("Rendering cover letter...");
      console.log("Rendering cover letter...");
      const coverCanvas = await this.renderer.renderSection({ html: coverLetterHTML });
      this.renderer.addCanvasToPDF(pdf, coverCanvas, isFirstPage);
      isFirstPage = false;
    }
    
    // Render superbill
    onProgress?.("Rendering superbill...");
    console.log("Rendering superbill...");
    const superbillCanvas = await this.renderer.renderSection({ html: superbillHTML });
    this.renderer.addCanvasToPDF(pdf, superbillCanvas, isFirstPage);
    
    return pdf.output('blob');
  }

  generateFileName(superbill: Superbill): string {
    return `Superbill-${superbill.patientName.replace(/\s+/g, "-")}-${formatDate(superbill.issueDate)}.pdf`;
  }

  downloadPDF(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
