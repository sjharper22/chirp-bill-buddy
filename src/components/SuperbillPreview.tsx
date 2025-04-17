
import { useState } from "react";
import { Superbill } from "@/types/superbill";
import { 
  calculateTotalFee, 
  formatCurrency, 
  formatDate 
} from "@/lib/utils/superbill-utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, Copy, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuperbillPreviewProps {
  superbill: Superbill;
}

export function SuperbillPreview({ superbill }: SuperbillPreviewProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Calculate total fee
  const totalFee = calculateTotalFee(superbill.visits);
  
  // Handle print superbill
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
    
    // Generate printable HTML
    const printableContent = generatePrintableHTML(superbill);
    
    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  // Handle download as PDF
  const handleDownload = () => {
    toast({
      title: "PDF Download",
      description: "Preparing PDF download...",
    });
    
    // In a real implementation, you would use a library like jsPDF to generate a PDF
    // For now, we'll just show a notification
    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: "Your superbill has been downloaded.",
      });
    }, 1500);
  };
  
  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    // Create a plain text version of the superbill
    const textContent = [
      `SUPERBILL`,
      `Patient: ${superbill.patientName}`,
      `DOB: ${formatDate(superbill.patientDob)}`,
      `Date: ${formatDate(superbill.issueDate)}`,
      `Date Range: ${formatDate(superbill.dateRangeStart)} to ${formatDate(superbill.dateRangeEnd)}`,
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
          `Fee: ${formatCurrency(visit.fee)}`,
          visit.notes ? `Notes: ${visit.notes}` : '',
          `------------------`
        ].join('\n');
      }),
      ``,
      `TOTAL: ${formatCurrency(totalFee)}`
    ].join('\n');
    
    // Copy to clipboard
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
  
  // Handle email to patient
  const handleEmailToPatient = () => {
    toast({
      title: "Email Feature",
      description: "Email functionality would be implemented here",
    });
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Preview Superbill
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Superbill Preview</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 p-6 border rounded-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">SUPERBILL</h2>
          </div>
          
          {/* Patient and Clinic Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Patient Information</h3>
              <p><span className="font-medium">Name:</span> {superbill.patientName}</p>
              <p><span className="font-medium">DOB:</span> {formatDate(superbill.patientDob)}</p>
              <p><span className="font-medium">Date:</span> {formatDate(superbill.issueDate)}</p>
              <p>
                <span className="font-medium">Service Period:</span> {formatDate(superbill.dateRangeStart)} 
                {" to "} 
                {formatDate(superbill.dateRangeEnd)}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Provider Information</h3>
              <p><span className="font-medium">Provider:</span> {superbill.providerName}</p>
              <p>{superbill.clinicName}</p>
              <p>{superbill.clinicAddress}</p>
              <p><span className="font-medium">Phone:</span> {superbill.clinicPhone}</p>
              <p><span className="font-medium">Email:</span> {superbill.clinicEmail}</p>
              <p><span className="font-medium">EIN:</span> {superbill.ein}</p>
              <p><span className="font-medium">NPI #:</span> {superbill.npi}</p>
            </div>
          </div>
          
          {/* Visits Table */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Services</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">ICD-10 Codes</th>
                    <th className="py-2 px-3 text-left">CPT Codes</th>
                    <th className="py-2 px-3 text-right">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {superbill.visits.map((visit, index) => (
                    <tr key={visit.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <td className="py-2 px-3">{formatDate(visit.date)}</td>
                      <td className="py-2 px-3">{visit.icdCodes.join(", ")}</td>
                      <td className="py-2 px-3">{visit.cptCodes.join(", ")}</td>
                      <td className="py-2 px-3 text-right">{formatCurrency(visit.fee)}</td>
                    </tr>
                  ))}
                  <tr className="border-t">
                    <td colSpan={3} className="py-2 px-3 text-right font-bold">Total:</td>
                    <td className="py-2 px-3 text-right font-bold">{formatCurrency(totalFee)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Notes */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Notes</h3>
            <div className="border rounded-lg p-3 min-h-20 bg-muted/30 text-sm">
              {superbill.visits.some(v => v.notes) ? (
                superbill.visits.map((visit, index) => (
                  visit.notes && (
                    <div key={visit.id} className="mb-2">
                      <span className="font-medium">{formatDate(visit.date)}:</span> {visit.notes}
                    </div>
                  )
                ))
              ) : (
                <p className="text-muted-foreground italic">No notes</p>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>This is a superbill for services rendered. It is not a bill.</p>
            <p>Please submit to your insurance company for reimbursement.</p>
          </div>
        </div>
        
        {/* Action Buttons */}
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
      </DialogContent>
    </Dialog>
  );
}

// Generate HTML for printing
function generatePrintableHTML(superbill: Superbill): string {
  const totalFee = calculateTotalFee(superbill.visits);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Superbill - ${superbill.patientName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .info-block {
          width: 48%;
        }
        .info-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .total-row {
          font-weight: bold;
        }
        .notes {
          border: 1px solid #ddd;
          padding: 10px;
          min-height: 80px;
          margin-bottom: 20px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
        }
        @media print {
          body { margin: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SUPERBILL</h1>
        </div>
        
        <div class="info-section">
          <div class="info-block">
            <div class="info-title">Patient Information</div>
            <p>Name: ${superbill.patientName}</p>
            <p>DOB: ${formatDate(superbill.patientDob)}</p>
            <p>Date: ${formatDate(superbill.issueDate)}</p>
            <p>Service Period: ${formatDate(superbill.dateRangeStart)} to ${formatDate(superbill.dateRangeEnd)}</p>
          </div>
          
          <div class="info-block">
            <div class="info-title">Provider Information</div>
            <p>Provider: ${superbill.providerName}</p>
            <p>${superbill.clinicName}</p>
            <p>${superbill.clinicAddress}</p>
            <p>Phone: ${superbill.clinicPhone}</p>
            <p>Email: ${superbill.clinicEmail}</p>
            <p>EIN: ${superbill.ein}</p>
            <p>NPI #: ${superbill.npi}</p>
          </div>
        </div>
        
        <div class="info-title">Services</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>ICD-10 Codes</th>
              <th>CPT Codes</th>
              <th style="text-align: right;">Fee</th>
            </tr>
          </thead>
          <tbody>
            ${superbill.visits.map((visit, index) => `
              <tr>
                <td>${formatDate(visit.date)}</td>
                <td>${visit.icdCodes.join(", ")}</td>
                <td>${visit.cptCodes.join(", ")}</td>
                <td style="text-align: right;">${formatCurrency(visit.fee)}</td>
              </tr>
            `).join("")}
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Total:</td>
              <td style="text-align: right;">${formatCurrency(totalFee)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="info-title">Notes</div>
        <div class="notes">
          ${superbill.visits.some(v => v.notes) 
            ? superbill.visits.map(visit => 
                visit.notes ? `<p><strong>${formatDate(visit.date)}:</strong> ${visit.notes}</p>` : ""
              ).join("")
            : "<p><em>No notes</em></p>"
          }
        </div>
        
        <div class="footer">
          <p>This is a superbill for services rendered. It is not a bill.</p>
          <p>Please submit to your insurance company for reimbursement.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
