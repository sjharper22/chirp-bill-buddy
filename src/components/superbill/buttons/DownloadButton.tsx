
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { useState } from "react";
import { PDFGenerator } from "@/lib/utils/pdf/pdf-generator";

interface DownloadButtonProps {
  superbill: Superbill;
}

export function DownloadButton({ superbill }: DownloadButtonProps) {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfGenerator = new PDFGenerator();
  
  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    
    try {
      toast({
        title: "PDF Download",
        description: "Preparing PDF download...",
      });

      const pdfBlob = await pdfGenerator.generatePDF({
        superbill,
        onProgress: (message) => {
          console.log(message);
        }
      });

      const fileName = pdfGenerator.generateFileName(superbill);
      pdfGenerator.downloadPDF(pdfBlob, fileName);
      
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
