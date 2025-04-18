
import { Superbill } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Printer, Download, Copy, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePrintableHTML } from "@/lib/utils/html-generator";
import { formatDate } from "@/lib/utils/superbill-utils";
import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ActionButtonsProps {
  superbill: Superbill;
}

export function ActionButtons({ superbill }: ActionButtonsProps) {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
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
  
  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    toast({
      title: "PDF Download",
      description: "Preparing PDF download...",
    });
    
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "-9999px";
    tempContainer.innerHTML = generatePrintableHTML(superbill);
    document.body.appendChild(tempContainer);
    
    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      
      const fileName = `Superbill-${superbill.patientName.replace(/\s+/g, "-")}-${formatDate(superbill.issueDate)}.pdf`;
      
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
      document.body.removeChild(tempContainer);
      setIsGeneratingPDF(false);
    }
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
      <Button variant="outline" onClick={handleDownload} disabled={isGeneratingPDF}>
        <Download className="mr-2 h-4 w-4" />
        {isGeneratingPDF ? "Generating..." : "Download PDF"}
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
