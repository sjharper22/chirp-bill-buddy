
import { Superbill } from "@/types/superbill";
import { generatePrintableHTML } from "@/lib/utils/html-generator";
import { createPDFDocument, addPDFMetadata, generateFileName } from "./pdf-generator";
import { renderSection } from "./canvas-renderer";
import { addCanvasToPDF } from "./page-handler";

export async function generateSuperbillPDF(superbill: Superbill, coverLetterContent?: string): Promise<void> {
  console.log("Starting PDF generation...");
  const { coverLetterHTML, superbillHTML } = generatePrintableHTML(superbill, coverLetterContent);
  
  console.log("Generated HTML lengths:", {
    coverLetter: coverLetterHTML.length,
    superbill: superbillHTML.length
  });
  
  const pdf = createPDFDocument();
  
  // Professional margins for healthcare documents
  const margin = 15; // Slightly larger margins for better appearance
  const contentWidth = 210 - (margin * 2);
  
  let isFirstPage = true;
  
  // Add cover letter if exists
  if (coverLetterHTML && coverLetterHTML.trim() !== '') {
    console.log("Rendering cover letter...");
    const coverCanvas = await renderSection(coverLetterHTML);
    console.log("Cover letter canvas dimensions:", coverCanvas.width, coverCanvas.height);
    addCanvasToPDF(pdf, coverCanvas, margin, contentWidth);
    isFirstPage = false;
  }
  
  // Add new page for superbill if cover letter was added
  if (!isFirstPage) {
    pdf.addPage();
  }
  
  // Add superbill
  console.log("Rendering superbill...");
  const superbillCanvas = await renderSection(superbillHTML);
  console.log("Superbill canvas dimensions:", superbillCanvas.width, superbillCanvas.height);
  addCanvasToPDF(pdf, superbillCanvas, margin, contentWidth);
  
  // Add PDF metadata for professional appearance
  addPDFMetadata(pdf, superbill);
  
  const fileName = generateFileName(superbill);
  pdf.save(fileName);
}
