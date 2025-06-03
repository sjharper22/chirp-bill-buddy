
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { generatePrintableHTML } from "@/lib/utils/html-generator";

interface PrintButtonProps {
  superbill: Superbill;
}

export function PrintButton({ superbill }: PrintButtonProps) {
  const { toast } = useToast();
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your popup settings.",
        variant: "destructive"
      });
      return;
    }
    
    const { coverLetterHTML, superbillHTML } = generatePrintableHTML(superbill);
    
    // Combine the HTML for printing
    const combinedHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Superbill - ${superbill.patientName}</title>
        <style>
          @media print {
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        ${coverLetterHTML ? `<div>${coverLetterHTML}</div><div class="page-break"></div>` : ''}
        <div>${superbillHTML}</div>
      </body>
      </html>
    `;
    
    printWindow.document.write(combinedHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <Button variant="outline" onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" />
      Print
    </Button>
  );
}
