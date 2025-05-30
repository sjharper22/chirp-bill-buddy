
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
      // Create a new window for rendering
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }
      
      // Generate the complete HTML document
      const htmlContent = generatePrintableHTML(superbill, coverLetterContent);
      
      // Write the HTML to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for the document to load completely
      await new Promise((resolve) => {
        printWindow.onload = resolve;
        // Fallback timeout
        setTimeout(resolve, 2000);
      });
      
      // Wait a bit more for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capture the content from the print window
      const canvas = await html2canvas(printWindow.document.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 800,
        height: printWindow.document.body.scrollHeight,
        windowWidth: 800,
        windowHeight: printWindow.document.body.scrollHeight,
        allowTaint: false,
        foreignObjectRendering: false,
        removeContainer: true
      });
      
      // Close the print window
      printWindow.close();
      
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
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;
      
      // Add first page
      pdf.addImage(canvas, "PNG", margin, margin + position, contentWidth, imgHeight);
      heightLeft -= contentHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = -contentHeight * pageNumber;
        pdf.addPage();
        pdf.addImage(canvas, "PNG", margin, margin + position, contentWidth, imgHeight);
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
