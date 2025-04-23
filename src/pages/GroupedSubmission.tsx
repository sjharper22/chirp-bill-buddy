
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { Superbill } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { CoverSheet } from "@/components/cover-sheet/CoverSheet";
import { Preview } from "@/components/preview/Preview";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { generatePrintableHTML } from "@/lib/utils/html-generator";

export default function GroupedSubmission() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patients, selectedPatientIds } = usePatient();
  const { superbills } = useSuperbill();
  
  // Get the selected patient IDs from the location state or use the ones from context
  const patientIds = location.state?.selectedPatientIds || selectedPatientIds;
  
  // Get superbills for selected patients
  const [selectedSuperbills, setSelectedSuperbills] = useState<Superbill[]>([]);
  const [includeCoverSheet, setIncludeCoverSheet] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewSuperbill, setPreviewSuperbill] = useState<Superbill | null>(null);
  
  useEffect(() => {
    // Find patients by IDs
    const selectedPatients = patients.filter(patient => patientIds.includes(patient.id));
    
    // Find superbills for those patients by name
    const patientNames = selectedPatients.map(patient => patient.name);
    const matchingSuperbills = superbills.filter(bill => patientNames.includes(bill.patientName));
    
    setSelectedSuperbills(matchingSuperbills);
  }, [patientIds, patients, superbills]);
  
  const handlePrintAll = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print documents.');
      return;
    }
    
    // Start building the complete HTML content
    let completeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Grouped Superbill Submission</title>
          <style>
            @media print {
              .page-break { page-break-after: always; }
            }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          </style>
        </head>
        <body>
    `;
    
    // Add cover sheet if selected
    if (includeCoverSheet && selectedSuperbills.length > 0) {
      const coverSheetHtml = generateCoverSheetHtml(selectedSuperbills);
      completeHtml += coverSheetHtml + '<div class="page-break"></div>';
    }
    
    // Add each superbill
    selectedSuperbills.forEach((superbill, index) => {
      const superbillHtml = generatePrintableHTML(superbill);
      // Extract the body content from the superbill HTML
      const bodyContent = superbillHtml.match(/<body>([\s\S]*)<\/body>/)?.[1] || '';
      completeHtml += bodyContent;
      
      // Add page break after each superbill except the last one
      if (index < selectedSuperbills.length - 1) {
        completeHtml += '<div class="page-break"></div>';
      }
    });
    
    // Close the HTML
    completeHtml += `
        </body>
      </html>
    `;
    
    // Write to the new window and print
    printWindow.document.open();
    printWindow.document.write(completeHtml);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  const generateCoverSheetHtml = (superbills: Superbill[]): string => {
    if (superbills.length === 0) return '';
    
    const firstSuperbill = superbills[0];
    const totalPatients = new Set(superbills.map(bill => bill.patientName)).size;
    const totalVisits = superbills.reduce((total, bill) => total + bill.visits.length, 0);
    const totalCharges = superbills.reduce((total, bill) => {
      return total + bill.visits.reduce((subtotal, visit) => subtotal + visit.fee, 0);
    }, 0);
    
    return `
      <div style="max-width: 800px; margin: 0 auto; border: 2px solid #ddd; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0;">Insurance Submission Cover Sheet</h1>
          <p style="color: #666;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <h3 style="margin-bottom: 10px;">Submission Summary</h3>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p style="color: #666; margin: 0;">Total Patients</p>
              <p style="font-size: 24px; font-weight: bold; margin: 0;">${totalPatients}</p>
            </div>
            <div>
              <p style="color: #666; margin: 0;">Total Visits</p>
              <p style="font-size: 24px; font-weight: bold; margin: 0;">${totalVisits}</p>
            </div>
            <div>
              <p style="color: #666; margin: 0;">Total Charges</p>
              <p style="font-size: 24px; font-weight: bold; margin: 0;">$${totalCharges.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <h3 style="margin-bottom: 10px;">Provider Information</h3>
          <p><span style="font-weight: 500;">Provider:</span> ${firstSuperbill.providerName}</p>
          <p><span style="font-weight: 500;">Clinic:</span> ${firstSuperbill.clinicName}</p>
          <p><span style="font-weight: 500;">Address:</span> ${firstSuperbill.clinicAddress}</p>
          <p><span style="font-weight: 500;">Phone:</span> ${firstSuperbill.clinicPhone}</p>
          <p><span style="font-weight: 500;">Email:</span> ${firstSuperbill.clinicEmail}</p>
          <p><span style="font-weight: 500;">EIN:</span> ${firstSuperbill.ein}</p>
          <p><span style="font-weight: 500;">NPI #:</span> ${firstSuperbill.npi}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="margin-bottom: 10px;">Submission Instructions</h3>
          <div style="background: #f7f7f7; padding: 15px; border-radius: 6px;">
            <ol style="padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">Submit all attached superbills to your insurance provider.</li>
              <li style="margin-bottom: 8px;">Include this cover sheet with your submission.</li>
              <li style="margin-bottom: 8px;">Keep copies of all documents for your records.</li>
              <li style="margin-bottom: 8px;">Contact your insurance provider if you have any questions about the submission process.</li>
              <li style="margin-bottom: 0;">For billing questions, contact the provider using the information above.</li>
            </ol>
          </div>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px;">
          <h3 style="margin-bottom: 10px;">Included Patients</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px;">
            ${superbills.map(bill => `
              <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
                <p style="font-weight: 500; margin: 0;">${bill.patientName}</p>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">DOB: ${new Date(bill.patientDob).toLocaleDateString()}</p>
                <p style="font-size: 14px; margin: 0;">
                  Visits: ${bill.visits.length}, 
                  Total: $${bill.visits.reduce((t, v) => t + v.fee, 0).toFixed(2)}
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };
  
  if (selectedSuperbills.length === 0) {
    return (
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-lg font-medium mt-4 mb-2">No superbills for selected patients</p>
          <p className="text-muted-foreground mb-6">
            Create superbills for the selected patients before creating a grouped submission
          </p>
          <Button onClick={() => navigate("/new")}>
            Create New Superbill
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Grouped Submission</h1>
          <p className="text-muted-foreground">
            {selectedSuperbills.length} superbill{selectedSuperbills.length !== 1 ? 's' : ''} selected for submission
          </p>
        </div>
        
        <Button onClick={handlePrintAll}>
          Print All Documents
        </Button>
      </div>
      
      <div className="flex items-center mb-4">
        <Checkbox 
          id="include-cover" 
          checked={includeCoverSheet}
          onCheckedChange={() => setIncludeCoverSheet(!includeCoverSheet)}
        />
        <label 
          htmlFor="include-cover" 
          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Include cover sheet
        </label>
      </div>
      
      {includeCoverSheet && (
        <CoverSheet superbills={selectedSuperbills} />
      )}
      
      <h2 className="text-xl font-semibold mb-4">Included Superbills</h2>
      <div className="space-y-4">
        {selectedSuperbills.map(superbill => (
          <div key={superbill.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{superbill.patientName}</h3>
                <p className="text-sm text-muted-foreground">
                  {superbill.visits.length} visit{superbill.visits.length !== 1 ? 's' : ''} | 
                  ${superbill.visits.reduce((total, visit) => total + visit.fee, 0).toFixed(2)}
                </p>
              </div>
              
              <Dialog open={dialogOpen && previewSuperbill?.id === superbill.id} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setPreviewSuperbill(null);
              }}>
                <DialogTrigger asChild>
                  <Button variant="ghost" onClick={() => setPreviewSuperbill(superbill)}>
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Superbill Preview</DialogTitle>
                  </DialogHeader>
                  {previewSuperbill && (
                    <Preview superbill={previewSuperbill} />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
