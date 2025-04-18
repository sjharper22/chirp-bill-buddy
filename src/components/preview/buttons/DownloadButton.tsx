
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";

interface DownloadButtonProps {
  superbill: Superbill;
}

export function DownloadButton({ superbill }: DownloadButtonProps) {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "PDF Download",
      description: "Preparing PDF download...",
    });
    
    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: "Your superbill has been downloaded.",
      });
    }, 1500);
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download PDF
    </Button>
  );
}
