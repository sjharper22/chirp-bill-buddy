
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
  
  const handleDownload = async () => {
    setIsGenerating(true);
    toast({
      title: "PDF Download",
      description: "Preparing PDF download...",
    });
    
    try {
      // Create an iframe for isolated rendering
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '210mm'; // A4 width
      iframe.style.height = '297mm'; // A4 height
      iframe.style.border = 'none';
      iframe.style.backgroundColor = '#ffffff';
      iframe.style.zoom = '1';
      
      document.body.appendChild(iframe);
      
      // Wait for iframe to be ready
      await new Promise((resolve) => {
        iframe.onload = resolve;
        setTimeout(resolve, 100); // Fallback
      });
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Could not access iframe document');
      }
      
      // Generate the complete HTML document
      const htmlContent = generatePrintableHTML(superbill, coverLetterContent);
      
      // Write HTML to iframe
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      // Wait for content to render and fonts to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Force layout recalculation
      const body = iframeDoc.body;
      if (body) {
        body.style.transform = 'scale(1)';
        body.offsetHeight; // Trigger reflow
        
        // Wait a bit more after reflow
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Capture the content with html2canvas using higher quality settings
      const canvas = await html2canvas(body, {
        scale: 2, // Higher scale for better text clarity
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: body.scrollWidth,
        height: body.scrollHeight,
        allowTaint: false,
        foreignObjectRendering: true, // Better for text rendering
        removeContainer: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Ensure proper styling in cloned document
          const clonedBody = clonedDoc.body;
          if (clonedBody) {
            clonedBody.style.width = '210mm';
            clonedBody.style.margin = '0';
            clonedBody.style.padding = '15mm';
            clonedBody.style.backgroundColor = '#ffffff';
            clonedBody.style.fontFamily = 'Arial, sans-serif';
            clonedBody.style.fontSize = '12px';
            clonedBody.style.lineHeight = '1.4';
            clonedBody.style.color = '#000000';
            
            // Ensure all text is crisp
            const allElements = clonedBody.querySelectorAll('*');
            allElements.forEach((el: any) => {
              el.style.webkitFontSmoothing = 'antialiased';
              el.style.mozOsxFontSmoothing = 'grayscale';
            });
          }
        }
      });
      
      // Clean up iframe
      document.body.removeChild(iframe);
      
      // Create PDF with exact A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: false // Disable compression for better quality
      });
      
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      
      // Calculate scaling to fit the canvas exactly to A4 size
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      // Split content across multiple pages if needed
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;
      
      // Add first page with full page coverage
      pdf.addImage(
        canvas.toDataURL('image/png', 1.0), // Maximum quality
        "PNG", 
        0, // No margin - full page
        position, 
        imgWidth, 
        imgHeight,
        undefined,
        'FAST' // Use FAST compression for better quality
      );
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = -pageHeight * pageNumber;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png', 1.0), // Maximum quality
          "PNG", 
          0, // No margin - full page
          position, 
          imgWidth, 
          imgHeight,
          undefined,
          'FAST' // Use FAST compression for better quality
        );
        heightLeft -= pageHeight;
        pageNumber++;
      }
      
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
