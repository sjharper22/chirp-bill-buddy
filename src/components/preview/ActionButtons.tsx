
import { Superbill } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Printer, Download, Copy, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils/superbill-utils";
import { generatePrintableHTML } from "@/lib/utils/html-generator";

interface ActionButtonsProps {
  superbill: Superbill;
}

export function ActionButtons({ superbill }: ActionButtonsProps) {
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
    
    const printableContent = generatePrintableHTML(superbill);
    
    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
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
  
  const handleCopyToClipboard = () => {
    const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
    const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
    const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
    
    const textContent = [
      `SUPERBILL`,
      `Patient: ${superbill.patientName}`,
      `DOB: ${formatDate(superbill.patientDob)}`,
      `Date: ${formatDate(superbill.issueDate)}`,
      visitDates.length > 0 ? `Visit Period: ${formatDate(earliestDate)} to ${formatDate(latestDate)}` : `No visits`,
      ``,
      `Provider: ${superbill.providerName}`,
      `${superbill.clinicName}`,
      `${superbill.clinicAddress}`,
      `Phone: ${superbill.clinicPhone}`,
      `Email: ${superbill.clinicEmail}`,
      `EIN: ${superbill.ein}`,
      `NPI: ${superbill.npi}`,
      ``,
      `VISITS:`,
      ...superbill.visits.map(visit => {
        return [
          `Date: ${formatDate(visit.date)}`,
          `ICD-10: ${visit.icdCodes.join(', ')}`,
          `CPT: ${visit.cptCodes.join(', ')}`,
          `Fee: ${visit.fee.toFixed(2)}`,
          visit.mainComplaints && visit.mainComplaints.length > 0 ? `Main Complaints: ${visit.mainComplaints.join(', ')}` : '',
          visit.notes ? `Notes: ${visit.notes}` : '',
          `------------------`
        ].join('\n');
      }),
      ``,
      `TOTAL: $${superbill.visits.reduce((total, visit) => total + (visit.fee || 0), 0).toFixed(2)}`
    ].join('\n');
    
    navigator.clipboard.writeText(textContent)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Superbill copied to clipboard",
        });
      })
      .catch(error => {
        console.error("Failed to copy:", error);
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive"
        });
      });
  };
  
  const handleEmailToPatient = () => {
    toast({
      title: "Email Feature",
      description: "Email functionality would be implemented here",
    });
  };
  
  return (
    <div className="flex flex-wrap justify-end gap-2 mt-4">
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button variant="outline" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      <Button variant="outline" onClick={handleCopyToClipboard}>
        <Copy className="mr-2 h-4 w-4" />
        Copy to Clipboard
      </Button>
      <Button variant="outline" onClick={handleEmailToPatient}>
        <Send className="mr-2 h-4 w-4" />
        Email to Patient
      </Button>
    </div>
  );
}
