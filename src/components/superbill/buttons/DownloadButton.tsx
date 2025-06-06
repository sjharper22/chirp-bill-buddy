
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { generatePrintableHTML } from "@/lib/utils/html-generator";
import { formatDate } from "@/lib/utils/superbill-utils";
import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface DownloadButtonProps {
  superbill: Superbill;
}

export function DownloadButton({ superbill }: DownloadButtonProps) {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const addCanvasToPDF = (pdf: jsPDF, canvas: HTMLCanvasElement, margin: number, contentWidth: number) => {
    const pageHeight = 297; // A4 height in mm
    const availableHeight = pageHeight - (margin * 2); // Available height for content
    
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    
    // If content fits on one page, add it directly
    if (imgHeight <= availableHeight) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, imgHeight);
      return;
    }
    
    // Content is too tall - split into multiple pages
    const totalPages = Math.ceil(imgHeight / availableHeight);
    
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      
      // Calculate the portion of the image to show on this page
      const sourceY = (canvas.height / totalPages) * page;
      const sourceHeight = Math.min(canvas.height / totalPages, canvas.height - sourceY);
      
      // Create a new canvas for this page's content
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        // Draw the relevant portion of the original canvas
        ctx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight, // Source rectangle
          0, 0, canvas.width, sourceHeight // Destination rectangle
        );
        
        // Calculate the height for this page portion
        const pageImgHeight = (sourceHeight * contentWidth) / canvas.width;
        
        // Add this portion to the PDF
        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, pageImgHeight);
      }
    }
  };
  
  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    toast({
      title: "PDF Download",
      description: "Preparing PDF download...",
    });
    
    try {
      const { coverLetterHTML, superbillHTML } = generatePrintableHTML(superbill);
      
      // Create a temporary container for HTML content
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "794px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.padding = "20px";
      tempContainer.style.boxSizing = "border-box";
      
      // Combine HTML for canvas rendering
      const combinedHTML = `
        ${coverLetterHTML ? `<div>${coverLetterHTML}</div><div style="page-break-before: always;"></div>` : ''}
        <div>${superbillHTML}</div>
      `;
      
      tempContainer.innerHTML = combinedHTML;
      document.body.appendChild(tempContainer);
      
      // Wait for images to load before rendering
      const images = tempContainer.querySelectorAll('img');
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
      
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794,
        height: tempContainer.scrollHeight,
        windowWidth: 794,
        windowHeight: tempContainer.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.body.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.position = 'static';
            clonedContainer.style.transform = 'none';
            clonedContainer.style.width = '794px';
            clonedContainer.style.margin = '0';
            clonedContainer.style.padding = '20px';
            clonedContainer.style.boxSizing = 'border-box';
          }
        }
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Calculate dimensions with proper margins
      const margin = 15;
      const contentWidth = 210 - (margin * 2); // A4 width minus margins
      
      // Add the canvas using smart splitting
      addCanvasToPDF(pdf, canvas, margin, contentWidth);
      
      const fileName = `Superbill-${superbill.patientName.replace(/\s+/g, "-")}-${formatDate(superbill.issueDate)}.pdf`;
      
      pdf.save(fileName);
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      toast({
        title: "PDF Downloaded",
        description: "Your superbill has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload} disabled={isGeneratingPDF}>
      <Download className="mr-2 h-4 w-4" />
      {isGeneratingPDF ? "Generating..." : "Download PDF"}
    </Button>
  );
}
