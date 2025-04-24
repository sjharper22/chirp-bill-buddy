import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CoverSheet } from "@/components/cover-sheet/CoverSheet";
import { PatientWithSuperbills } from "@/components/group-submission/types";
import { GroupFilters } from "@/components/group-submission/GroupFilters";
import { BulkActions } from "@/components/group-submission/BulkActions";
import { GroupTable } from "@/components/group-submission/GroupTable";
import { GroupStats } from "@/components/group-submission/GroupStats";

// Helper function to determine superbill status
const determineStatus = (superbills: Superbill[]): "Complete" | "Missing Info" | "Draft" | "No Superbill" => {
  if (superbills.length === 0) return "No Superbill";
  
  // A complete superbill has all required info
  const hasAllInfo = superbills.every(bill => 
    bill.patientName && 
    bill.visits.length > 0 && 
    bill.visits.every(visit => visit.icdCodes.length > 0 && visit.cptCodes.length > 0)
  );
  
  if (hasAllInfo) return "Complete";
  
  // If any visit is missing codes or fees, it's incomplete
  const hasMissingInfo = superbills.some(bill => 
    bill.visits.some(visit => 
      visit.icdCodes.length === 0 || 
      visit.cptCodes.length === 0 || 
      visit.fee <= 0
    )
  );
  
  if (hasMissingInfo) return "Missing Info";
  return "Draft";
};

export default function GroupedSubmission() {
  const navigate = useNavigate();
  const { patients } = usePatient();
  const { superbills } = useSuperbill();
  
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [patientsWithSuperbills, setPatientsWithSuperbills] = useState<PatientWithSuperbills[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCoverSheet, setShowCoverSheet] = useState(false);
  
  // Process patients and their superbills
  useEffect(() => {
    const processed = patients.map(patient => {
      // Find superbills for this patient
      const patientSuperbills = superbills.filter(bill => bill.patientName === patient.name);
      
      // Calculate total visits and amount
      const totalVisits = patientSuperbills.reduce((total, bill) => total + bill.visits.length, 0);
      const totalAmount = patientSuperbills.reduce((total, bill) => {
        return total + bill.visits.reduce((subtotal, visit) => subtotal + visit.fee, 0);
      }, 0);
      
      // Determine date range across all visits
      let earliestDate: Date | null = null;
      let latestDate: Date | null = null;
      
      patientSuperbills.forEach(bill => {
        bill.visits.forEach(visit => {
          if (!earliestDate || visit.date < earliestDate) {
            earliestDate = visit.date;
          }
          if (!latestDate || visit.date > latestDate) {
            latestDate = visit.date;
          }
        });
      });
      
      // Set date range if we found valid dates
      const dateRange = (earliestDate && latestDate)
        ? { start: earliestDate, end: latestDate }
        : null;
      
      return {
        ...patient,
        superbills: patientSuperbills,
        totalVisits,
        totalAmount,
        status: determineStatus(patientSuperbills),
        dateRange
      };
    });
    
    setPatientsWithSuperbills(processed);
  }, [patients, superbills]);
  
  // Filter patients based on search and status
  const filteredPatients = patientsWithSuperbills.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? patient.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });
  
  // Handle selection
  const togglePatientSelection = (id: string) => {
    setSelectedPatientIds(prev => 
      prev.includes(id) 
        ? prev.filter(patientId => patientId !== id) 
        : [...prev, id]
    );
  };
  
  const selectAll = () => {
    setSelectedPatientIds(filteredPatients.map(patient => patient.id));
  };
  
  const clearSelection = () => {
    setSelectedPatientIds([]);
  };
  
  // Get selected patients and their superbills
  const selectedPatients = filteredPatients.filter(patient => 
    selectedPatientIds.includes(patient.id)
  );
  
  const selectedSuperbills = selectedPatients.flatMap(patient => patient.superbills);
  
  // Handle print/download all
  const handleDownloadAll = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download documents.');
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
    
    // Add cover sheet if any superbills are selected
    if (showCoverSheet && selectedSuperbills.length > 0) {
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
  
  // Generate HTML for cover sheet
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

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Group Submissions</h1>
          <p className="text-muted-foreground">
            Manage and submit multiple superbills together
          </p>
        </div>
        
        <GroupStats 
          selectedPatients={selectedPatients}
          onClearSelection={clearSelection}
        />
      </div>
      
      <GroupFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      {selectedPatientIds.length > 0 && (
        <BulkActions
          selectedSuperbills={selectedSuperbills}
          showCoverSheet={showCoverSheet}
          setShowCoverSheet={setShowCoverSheet}
          handleDownloadAll={handleDownloadAll}
          generateCoverSheetHtml={generateCoverSheetHtml}
        />
      )}
      
      <GroupTable
        filteredPatients={filteredPatients}
        selectedPatientIds={selectedPatientIds}
        togglePatientSelection={togglePatientSelection}
        clearSelection={clearSelection}
        selectAll={selectAll}
      />
      
      {showCoverSheet && selectedSuperbills.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Cover Sheet Preview</h2>
          <CoverSheet superbills={selectedSuperbills} />
        </div>
      )}
    </div>
  );
}
