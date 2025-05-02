import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { PatientWithSuperbills } from "@/components/group-submission/types";
import { GroupFilters } from "@/components/group-submission/GroupFilters";
import { BulkActions } from "@/components/group-submission/BulkActions";
import { GroupTable } from "@/components/group-submission/GroupTable";
import { GroupHeader } from "@/components/group-submission/GroupHeader";
import { GroupPreview } from "@/components/group-submission/GroupPreview";
import { generateCoverSheetHtml } from "@/lib/utils/cover-sheet-generator";
import { generatePrintableHTML } from "@/lib/utils/html-generator";
import { Superbill } from "@/types/superbill";

// Helper function to determine superbill status
const determineStatus = (superbills: Superbill[]): "Complete" | "Missing Info" | "Draft" | "No Superbill" => {
  if (superbills.length === 0) return "No Superbill";

  // First, directly check if any superbill has a specific status
  // This ensures we respect the superbill's own status field
  const hasInProgressSuperbill = superbills.some(bill => bill.status === 'in_progress');
  const hasInReviewSuperbill = superbills.some(bill => bill.status === 'in_review');
  const hasDraftSuperbill = superbills.some(bill => bill.status === 'draft');
  
  if (hasInProgressSuperbill) return "Missing Info"; // Map in_progress to Missing Info
  if (hasInReviewSuperbill) return "Missing Info";   // Map in_review to Missing Info
  if (hasDraftSuperbill) return "Draft";             // Map draft to Draft
  
  // Only if no status-based decision was made, fall back to the content-based logic
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

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <GroupHeader 
        selectedPatients={selectedPatients}
        onClearSelection={clearSelection}
        onNavigateBack={() => navigate(-1)}
      />
      
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
      
      <GroupPreview 
        showCoverSheet={showCoverSheet}
        selectedSuperbills={selectedSuperbills}
      />
    </div>
  );
}
