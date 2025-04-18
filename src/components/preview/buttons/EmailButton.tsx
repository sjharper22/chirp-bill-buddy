
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";

interface EmailButtonProps {
  superbill: Superbill;
}

export function EmailButton({ superbill }: EmailButtonProps) {
  const { toast } = useToast();
  
  const handleEmailToPatient = () => {
    toast({
      title: "Email Feature",
      description: "Email functionality would be implemented here",
    });
  };

  return (
    <Button variant="outline" onClick={handleEmailToPatient}>
      <Send className="mr-2 h-4 w-4" />
      Email to Patient
    </Button>
  );
}
