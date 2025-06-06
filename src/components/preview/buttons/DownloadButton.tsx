
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { useState } from "react";
import { generateSuperbillPDF } from "@/lib/utils/pdf/pdf-orchestrator";

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
      title: "PDF Generation",
      description: "Preparing your professional healthcare document...",
    });
    
    try {
      await generateSuperbillPDF(superbill, coverLetterContent);
      
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
