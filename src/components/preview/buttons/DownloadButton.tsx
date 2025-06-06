
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "@/lib/utils/superbill-utils";
import { generatePrintableHTML } from "@/lib/utils/html-generator";

interface DownloadButtonProps {
  superbill: Superbill;
  coverLetterContent?: string;
}

export function DownloadButton({ superbill, coverLetterContent }: DownloadButtonProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const renderSection = async (html: string): Promise<HTMLCanvasElement> => {
    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = "794px"; // A4 width at 96DPI for optimal quality
    container.style.backgroundColor = "#ffffff";
    document.body.appendChild(container);
    
    // Wait for images to load
    const images = container.querySelectorAll('img');
    const imageLoadPromises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true); // Continue even if image fails to load
          // Set a timeout to prevent hanging
          setTimeout(() => resolve(true), 3000);
        }
      });
    });
    
    await Promise.all(imageLoadPromises);
    
    // Wait for DOM rendering and fonts to load
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const canvas = await html2canvas(container, {
      scale: 2.5, // Higher scale for better text quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: 794,
      height: container.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.body.querySelector('div');
        if (clonedContainer) {
          clonedContainer.style.position = 'static';
          clonedContainer.style.transform = 'none';
          clonedContainer.style.width = '794px';
          clonedContainer.style.margin = '0';
        }
      }
    });
    
    document.body.removeChild(container);
    return canvas;
  };

  const addCanvasToPDF = (pdf: jsPDF, canvas: HTMLCanvasElement, margin: number, contentWidth: number) => {
    const pageHeight = 297; // A4 height in mm
    const contentHeight = pageHeight - (margin * 2); // Available height for content
    
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    
    // If content fits on one page, add it directly
    if (imgHeight <= contentHeight) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, imgHeight);
      return;
    }
    
    // Content is too tall - split into multiple pages
    const totalPages = Math.ceil(imgHeight / contentHeight);
    
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
    setIsGenerating(true);
    toast({
      title: "PDF Download",
      description: "Preparing PDF download...",
    });
    
    try {
      // Generate separate HTML for cover letter and superbill
      const { coverLetterHTML, superbillHTML } = generatePrintableHTML(superbill, coverLetterContent);
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const margin = 12.7; // 0.5 inch margins
      const contentWidth = 210 - (margin * 2); // A4 width minus margins
      
      let isFirstPage = true;
      
      // Render cover letter if content exists
      if (coverLetterHTML && coverLetterHTML.trim() !== '') {
        const coverCanvas = await renderSection(coverLetterHTML);
        addCanvasToPDF(pdf, coverCanvas, margin, contentWidth);
        isFirstPage = false;
      }
      
      // Add page break before superbill if cover letter was added
      if (!isFirstPage) {
        pdf.addPage();
      }
      
      // Render superbill
      const superbillCanvas = await renderSection(superbillHTML);
      addCanvasToPDF(pdf, superbillCanvas, margin, contentWidth);
      
      // Generate filename
      const fileName = `Superbill-${superbill.patientName.replace(/\s+/g, "-")}-${formatDate(superbill.issueDate)}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      
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
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleDownload} 
      disabled={isGenerating}
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  );
}
