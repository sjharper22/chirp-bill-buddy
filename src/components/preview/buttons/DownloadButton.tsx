
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "@/lib/utils/superbill-utils";

interface DownloadButtonProps {
  superbill: Superbill;
}

export function DownloadButton({ superbill }: DownloadButtonProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownload = async () => {
    setIsGenerating(true);
    toast({
      title: "PDF Download",
      description: "Preparing PDF download...",
    });
    
    try {
      // Get the preview element
      const previewElement = document.querySelector(".superbill-preview-content");
      
      if (!previewElement) {
        throw new Error("Preview element not found");
      }
      
      // Use html2canvas to capture the preview as an image
      const canvas = await html2canvas(previewElement as HTMLElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      // Create PDF with appropriate page size (A4)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Calculate dimensions to fit content properly
      const imgWidth = 210; // A4 width in mm (210mm)
      const pageHeight = 295; // A4 height in mm (297mm) minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to the PDF with multi-page support
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;
      
      // Add first page
      pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = -pageHeight * pageNumber;
        pdf.addPage();
        pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        pageNumber++;
      }
      
      // Generate a filename based on the patient name and date
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
