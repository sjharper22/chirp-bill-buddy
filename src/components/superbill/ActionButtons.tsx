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
  
  const addCanvasToPDF = (pdf: jsPDF, canvas: HTMLCanvasElement, margin: number, contentWidth: number) => {
    const pageHeight = 297; // A4 height in mm
    const contentHeight = pageHeight - (margin * 2); // Available height for content
    
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    
    // If content fits on one page, add it directly
    if (imgHeight <= contentHeight) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, imgHeight);
      return;
    }
    
    // Content is too tall - split into multiple pages
    const totalPages = Math.ceil(imgHeight / contentHeight);
    
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      
      // Calculate the portion of the image to show on this page
      const sourceY = (canvas.height / totalPages) * page;
      const sourceHeight = Math.min(canvas.height / totalPages, canvas.height - sourceY);
      
      // Create a new canvas for this page's content
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        // Draw the relevant portion of the original canvas
        ctx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight, // Source rectangle
          0, 0, canvas.width, sourceHeight // Destination rectangle
        );
        
        // Calculate the height for this page portion
        const pageImgHeight = (sourceHeight * contentWidth) / canvas.width;
        
        // Add this portion to the PDF
        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, pageImgHeight);
      }
    }
  };
  
  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    toast({
      title: "PDF Download",
      description: "Preparing PDF download...",
    });
    
    try {
      const { coverLetterHTML, superbillHTML } = generatePrintableHTML(superbill);
      
      // Create a temporary container for HTML content
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "800px";
      tempContainer.style.backgroundColor = "#ffffff";
      
      // Combine HTML for canvas rendering
      const combinedHTML = `
        ${coverLetterHTML ? `<div>${coverLetterHTML}</div><div style="page-break-before: always;"></div>` : ''}
        <div>${superbillHTML}</div>
      `;
      
      tempContainer.innerHTML = combinedHTML;
      document.body.appendChild(tempContainer);
      
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 800,
        height: tempContainer.offsetHeight,
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.body.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.position = 'static';
            clonedContainer.style.transform = 'none';
            clonedContainer.style.width = '800px';
            clonedContainer.style.margin = '0';
          }
        }
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Calculate dimensions with proper margins
      const margin = 20;
      const contentWidth = 210 - (margin * 2); // A4 width minus margins
      
      // Add the canvas using smart splitting
      addCanvasToPDF(pdf, canvas, margin, contentWidth);
      
      const fileName = `Superbill-${superbill.patientName.replace(/\s+/g, "-")}-${formatDate(superbill.issueDate)}.pdf`;
      
      pdf.save(fileName);
      
      // Clean up
      document.body.removeChild(tempContainer);
      
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
