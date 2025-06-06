
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { useState } from "react";
import { PDFGenerator } from "@/lib/utils/pdf/pdf-generator";

interface DownloadButtonProps {
  superbill: Superbill;
  coverLetterContent?: string;
}

export function DownloadButton({ superbill, coverLetterContent }: DownloadButtonProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfGenerator = new PDFGenerator();
  
  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      toast({
        title: "PDF Download",
        description: "Preparing PDF download...",
      });

      const pdfBlob = await pdfGenerator.generatePDF({
        superbill,
        coverLetterContent,
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
