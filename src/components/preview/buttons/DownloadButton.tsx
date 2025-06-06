
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
    container.style.width = "210mm"; // A4 width
    container.style.minHeight = "297mm"; // A4 height
    container.style.backgroundColor = "#ffffff";
    container.style.padding = "15mm";
    container.style.boxSizing = "border-box";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "12px";
    container.style.lineHeight = "1.4";
    document.body.appendChild(container);
    
    // Wait for images to load
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
    
    // Wait for DOM rendering and fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use higher DPI for better quality
    const scale = 2;
    const canvas = await html2canvas(container, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: container.scrollWidth,
      height: container.scrollHeight,
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.body.querySelector('div');
        if (clonedContainer) {
          clonedContainer.style.position = 'static';
          clonedContainer.style.transform = 'none';
          clonedContainer.style.width = '210mm';
          clonedContainer.style.minHeight = '297mm';
          clonedContainer.style.margin = '0';
          clonedContainer.style.padding = '15mm';
          clonedContainer.style.boxSizing = 'border-box';
        }
      }
    });
    
    document.body.removeChild(container);
    return canvas;
  };

  const addCanvasToPDF = (pdf: jsPDF, canvas: HTMLCanvasElement, isFirstPage: boolean = false) => {
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 0; // No margins since content already has padding
    
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    
    if (!isFirstPage) {
      pdf.addPage();
    }
    
    // If content fits on one page, add it directly
    if (imgHeight <= pageHeight) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, imgHeight);
      return;
    }
    
    // Content is too tall - split into multiple pages
    const totalPages = Math.ceil(imgHeight / pageHeight);
    
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
        const pageImgHeight = (sourceHeight * pageWidth) / canvas.width;
        
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
      
      let isFirstPage = true;
      
      // Render cover letter if content exists
      if (coverLetterHTML && coverLetterHTML.trim() !== '') {
        console.log("Rendering cover letter...");
        const coverCanvas = await renderSection(coverLetterHTML);
        addCanvasToPDF(pdf, coverCanvas, isFirstPage);
        isFirstPage = false;
      }
      
      // Render superbill
      console.log("Rendering superbill...");
      const superbillCanvas = await renderSection(superbillHTML);
      addCanvasToPDF(pdf, superbillCanvas, isFirstPage);
      
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
