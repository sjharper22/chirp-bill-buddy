
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
    
    // Wait for DOM rendering and fonts to load
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const canvas = await html2canvas(container, {
      scale: 2.5, // Higher scale for better text quality
      useCORS: true,
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
      
      // Render cover letter if content exists
      if (coverLetterHTML && coverLetterHTML.trim() !== '') {
        const coverCanvas = await renderSection(coverLetterHTML);
        const coverImgHeight = (coverCanvas.height * contentWidth) / coverCanvas.width;
        
        pdf.addImage(coverCanvas.toDataURL('image/png'), 'PNG', margin, margin, contentWidth, coverImgHeight);
        pdf.addPage(); // Add page break before superbill
      }
      
      // Render superbill
      const superbillCanvas = await renderSection(superbillHTML);
      const superbillImgHeight = (superbillCanvas.height * contentWidth) / superbillCanvas.width;
      
      pdf.addImage(superbillCanvas.toDataURL('image/png'), 'PNG', margin, margin, contentWidth, superbillImgHeight);
      
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
