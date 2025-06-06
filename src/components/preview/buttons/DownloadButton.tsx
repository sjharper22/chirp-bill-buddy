
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
    container.style.top = "0";
    container.style.width = "794px"; // A4 width at 96DPI
    container.style.backgroundColor = "#ffffff";
    container.style.fontFamily = "'Open Sans', Arial, sans-serif";
    container.style.color = "#000000";
    container.style.lineHeight = "1.5";
    container.style.fontSize = "14px";
    container.style.padding = "0";
    container.style.margin = "0";
    container.style.visibility = "visible";
    container.style.display = "block";
    document.body.appendChild(container);
    
    // Wait for DOM rendering and fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Force all elements to be visible and properly styled
    const allElements = container.querySelectorAll('*');
    allElements.forEach(el => {
      const element = el as HTMLElement;
      element.style.visibility = 'visible';
      element.style.display = element.style.display || 'block';
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.position = element.style.position === 'absolute' ? 'static' : element.style.position;
    });
    
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: "#ffffff",
      width: 794,
      height: container.scrollHeight,
      allowTaint: false,
      foreignObjectRendering: false,
      removeContainer: false,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.body.querySelector('div');
        if (clonedContainer) {
          // Ensure the cloned container is visible and properly positioned
          clonedContainer.style.position = 'static';
          clonedContainer.style.transform = 'none';
          clonedContainer.style.width = '794px';
          clonedContainer.style.margin = '0';
          clonedContainer.style.padding = '20px';
          clonedContainer.style.fontFamily = "'Open Sans', Arial, sans-serif";
          clonedContainer.style.backgroundColor = '#ffffff';
          clonedContainer.style.color = '#000000';
          clonedContainer.style.visibility = 'visible';
          clonedContainer.style.display = 'block';
          
          // Force all child elements to be visible
          const allClonedElements = clonedContainer.querySelectorAll('*');
          allClonedElements.forEach(el => {
            const element = el as HTMLElement;
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            element.style.color = element.style.color || '#000000';
            element.style.backgroundColor = element.style.backgroundColor || 'transparent';
          });
          
          // Ensure images are loaded in cloned document
          const images = clonedContainer.querySelectorAll('img');
          images.forEach(img => {
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.visibility = 'visible';
          });
        }
      }
    });
    
    document.body.removeChild(container);
    return canvas;
  };

  const addCanvasToPDF = (pdf: jsPDF, canvas: HTMLCanvasElement, margin: number, contentWidth: number) => {
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
  };
  
  const handleDownload = async () => {
    setIsGenerating(true);
    toast({
      title: "PDF Generation",
      description: "Preparing your professional healthcare document...",
    });
    
    try {
      console.log("Starting PDF generation...");
      const { coverLetterHTML, superbillHTML } = generatePrintableHTML(superbill, coverLetterContent);
      
      console.log("Generated HTML lengths:", {
        coverLetter: coverLetterHTML.length,
        superbill: superbillHTML.length
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });
      
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
      
      // Generate professional filename
      const timestamp = formatDate(superbill.issueDate).replace(/\//g, '-');
      const patientName = superbill.patientName.replace(/[^a-zA-Z0-9]/g, '-');
      const fileName = `Superbill-${patientName}-${timestamp}.pdf`;
      
      // Add PDF metadata for professional appearance
      pdf.setProperties({
        title: `Superbill - ${superbill.patientName}`,
        subject: 'Healthcare Services Documentation',
        author: superbill.clinicName,
        creator: superbill.clinicName
      });
      
      pdf.save(fileName);
      
      toast({
        title: "Download Complete",
        description: "Your professional superbill has been generated successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error creating your PDF. Please try again.",
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
      className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:from-emerald-100 hover:to-teal-100"
    >
      <Download className="mr-2 h-4 w-4 text-emerald-600" />
      <span className="text-emerald-700">
        {isGenerating ? "Generating Professional PDF..." : "Download PDF"}
      </span>
    </Button>
  );
}
