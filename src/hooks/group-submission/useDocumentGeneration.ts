
import { useState } from "react";
import { Superbill } from "@/types/superbill";
import { generateCoverSheetHtml } from "@/lib/utils/cover-sheet-generator";
import { generatePrintableHTML } from "@/lib/utils/html-generator";
import { generateCoverLetterFromSuperbills } from "@/lib/utils/cover-letter-generator";

export function useDocumentGeneration() {
  const [showCoverSheet, setShowCoverSheet] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(true);
  const [coverLetterContent, setCoverLetterContent] = useState("");
  const [isCoverLetterDialogOpen, setIsCoverLetterDialogOpen] = useState(false);
  
  // Handle preview cover letter
  const handlePreviewCoverLetter = (selectedSuperbills: Superbill[], includeInvoiceNote: boolean = true) => {
    // Generate cover letter content before opening dialog
    if (selectedSuperbills.length > 0) {
      // Ensure we're passing both parameters here
      const generatedContent = generateCoverLetterFromSuperbills(selectedSuperbills, includeInvoiceNote);
      setCoverLetterContent(generatedContent);
    }
    setIsCoverLetterDialogOpen(true);
  };
  
  // Handle print/download all
  const handleDownloadAll = (selectedSuperbills: Superbill[]) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download documents.');
      return;
    }
    
    // Start building the complete HTML content
    let completeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Grouped Superbill Submission</title>
          <style>
            @media print {
              .page-break { page-break-after: always; }
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              line-height: 1.5;
            }
            p {
              margin: 0 0 10px 0;
            }
            h1, h2, h3 {
              margin: 15px 0;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .cover-letter {
              margin-bottom: 30px;
              padding-bottom: 20px;
            }
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .info-block {
              width: 48%;
            }
            .clinic-info {
              margin-bottom: 20px;
            }
            .clinic-info p {
              margin: 3px 0;
            }
            ul, ol {
              padding-left: 25px;
            }
            li {
              margin-bottom: 8px;
            }
            .patient-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
            .patient-card {
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
    `;
    
    // Add cover letter if enabled
    if (showCoverLetter && selectedSuperbills.length > 0) {
      // Also ensure both parameters are passed here
      const coverLetterHtml = generateCoverLetterFromSuperbills(selectedSuperbills, true);
      completeHtml += `<div class="container cover-letter">${coverLetterHtml}</div><div class="page-break"></div>`;
    }
    
    // Add cover sheet if enabled
    if (showCoverSheet && selectedSuperbills.length > 0) {
      const coverSheetHtml = generateCoverSheetHtml(selectedSuperbills, true);
      completeHtml += `<div class="container">${coverSheetHtml}</div><div class="page-break"></div>`;
    }
    
    // Add each superbill
    selectedSuperbills.forEach((superbill, index) => {
      const superbillHtml = generatePrintableHTML(superbill);
      // Extract the body content from the superbill HTML
      const bodyContent = superbillHtml.match(/<body>([\s\S]*)<\/body>/)?.[1] || '';
      completeHtml += `<div class="container">${bodyContent}</div>`;
      
      // Add page break after each superbill except the last one
      if (index < selectedSuperbills.length - 1) {
        completeHtml += '<div class="page-break"></div>';
      }
    });
    
    // Close the HTML
    completeHtml += `
        </body>
      </html>
    `;
    
    // Write to the new window and print
    printWindow.document.open();
    printWindow.document.write(completeHtml);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  return {
    showCoverSheet,
    setShowCoverSheet,
    showCoverLetter,
    setShowCoverLetter,
    coverLetterContent,
    setCoverLetterContent,
    isCoverLetterDialogOpen,
    setIsCoverLetterDialogOpen,
    handlePreviewCoverLetter,
    handleDownloadAll
  };
}
