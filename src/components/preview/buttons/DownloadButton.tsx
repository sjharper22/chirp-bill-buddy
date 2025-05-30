
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
      // Create a temporary container with exact print dimensions
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-10000px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px'; // A4 width at 96 DPI (210mm)
      tempContainer.style.minHeight = '1123px'; // A4 height at 96 DPI (297mm)
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000000';
      tempContainer.style.padding = '40px';
      tempContainer.style.boxSizing = 'border-box';
      
      // Generate and insert the HTML content
      const htmlContent = generatePrintableHTML(superbill, coverLetterContent);
      
      // Create a wrapper div to ensure proper styling
      const wrapper = document.createElement('div');
      wrapper.innerHTML = htmlContent;
      wrapper.style.width = '100%';
      wrapper.style.fontFamily = 'Arial, sans-serif';
      wrapper.style.fontSize = '12px';
      wrapper.style.lineHeight = '1.4';
      wrapper.style.color = '#000000';
      
      tempContainer.appendChild(wrapper);
      document.body.appendChild(tempContainer);
      
      // Wait for fonts and content to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force a layout recalculation
      tempContainer.offsetHeight;
      
      // Use html2canvas with optimized settings for text quality
      const canvas = await html2canvas(tempContainer, {
        scale: 3, // Higher scale for crisp text
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794, // Fixed width
        height: tempContainer.scrollHeight,
        logging: false,
        foreignObjectRendering: false, // Disable for better text rendering
        removeContainer: false,
        imageTimeout: 30000,
        onclone: (clonedDoc) => {
          // Ensure the cloned document has proper styling
          const clonedContainer = clonedDoc.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.position = 'static';
            clonedContainer.style.left = 'auto';
            clonedContainer.style.width = '794px';
            clonedContainer.style.fontFamily = 'Arial, sans-serif';
            clonedContainer.style.fontSize = '12px';
            clonedContainer.style.lineHeight = '1.4';
            clonedContainer.style.color = '#000000';
            clonedContainer.style.backgroundColor = '#ffffff';
            
            // Ensure all text elements have proper anti-aliasing
            const allElements = clonedContainer.querySelectorAll('*');
            allElements.forEach((el: any) => {
              if (el.style) {
                el.style.webkitFontSmoothing = 'antialiased';
                el.style.mozOsxFontSmoothing = 'grayscale';
                el.style.textRendering = 'geometricPrecision';
              }
            });
          }
        }
      });
      
      // Clean up the temporary container
      document.body.removeChild(tempContainer);
      
      // Create PDF with high quality settings
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
        precision: 2
      });
      
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      
      // Calculate the image dimensions to fit A4
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      // Add the image to PDF with proper quality
      let remainingHeight = imgHeight;
      let yPosition = 0;
      let pageCount = 0;
      
      while (remainingHeight > 0) {
        if (pageCount > 0) {
          pdf.addPage();
        }
        
        const currentPageHeight = Math.min(remainingHeight, pageHeight);
        
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.98), // High quality JPEG
          'JPEG',
          0,
          yPosition,
          imgWidth,
          imgHeight,
          undefined,
          'MEDIUM' // Medium compression for balance of quality and size
        );
        
        remainingHeight -= pageHeight;
        yPosition -= pageHeight;
        pageCount++;
      }
      
      // Generate filename and save
      const fileName = `Superbill-${superbill.patientName.replace(/\s+/g, "-")}-${formatDate(superbill.issueDate)}.pdf`;
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
