
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
      iframe.style.width = '800px';
      iframe.style.height = '1200px';
      iframe.style.border = 'none';
      iframe.style.backgroundColor = '#ffffff';
      
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
      
      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Force a reflow to ensure all content is rendered
      const body = iframeDoc.body;
      if (body) {
        body.style.display = 'none';
        body.offsetHeight; // Trigger reflow
        body.style.display = 'block';
        
        // Wait a bit more after reflow
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Capture the content with html2canvas
      const canvas = await html2canvas(body, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 800,
        height: body.scrollHeight,
        windowWidth: 800,
        windowHeight: body.scrollHeight,
        allowTaint: false,
        foreignObjectRendering: false,
        removeContainer: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Ensure proper styling in cloned document
          const clonedBody = clonedDoc.body;
          if (clonedBody) {
            clonedBody.style.width = '800px';
            clonedBody.style.margin = '0';
            clonedBody.style.padding = '40px';
            clonedBody.style.backgroundColor = '#ffffff';
            clonedBody.style.fontFamily = 'Arial, sans-serif';
          }
        }
      });
      
      // Clean up iframe
      document.body.removeChild(iframe);
      
      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 15; // 15mm margin
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);
      
      // Calculate the height of the image when scaled to fit the page width
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      
      // Split content across multiple pages if needed
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;
      
      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), "PNG", margin, margin + position, imgWidth, imgHeight);
      heightLeft -= contentHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = -contentHeight * pageNumber;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), "PNG", margin, margin + position, imgWidth, imgHeight);
        heightLeft -= contentHeight;
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
