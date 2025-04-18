
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { formatDate } from "@/lib/utils/superbill-utils";

interface CopyButtonProps {
  superbill: Superbill;
}

export function CopyButton({ superbill }: CopyButtonProps) {
  const { toast } = useToast();
  
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

  return (
    <Button variant="outline" onClick={handleCopyToClipboard}>
      <Copy className="mr-2 h-4 w-4" />
      Copy to Clipboard
    </Button>
  );
}
