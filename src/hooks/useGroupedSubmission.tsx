
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { PatientWithSuperbills } from "@/components/group-submission/types";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { generateCoverSheetHtml } from "@/lib/utils/cover-sheet-generator";
import { generatePrintableHTML } from "@/lib/utils/html-generator";
import { generateCoverLetterFromSuperbills } from "@/lib/utils/cover-letter-generator";

// Helper function to determine superbill status
const determineStatus = (superbills: Superbill[]): "Draft" | "Complete" | "Missing Info" | "No Superbill" => {
  if (superbills.length === 0) return "No Superbill";

  // Check if any of the superbills have an explicit status
  // Always trust the superbill's own status field first
  for (const bill of superbills) {
    switch (bill.status) {
      case 'in_progress':
        return "Missing Info";
      case 'in_review':
        return "Missing Info";
      case 'draft':
        return "Draft";
      case 'completed':
        // Only mark as complete if all superbills are completed
        if (superbills.every(sb => sb.status === 'completed')) {
          return "Complete";
        }
        // Otherwise continue checking
    }
  }
  
  // If no definitive status from superbill status fields,
  // fall back to content-based determination
  
  // Check if all required information is present
  const hasAllInfo = superbills.every(bill => 
    bill.patientName && 
    bill.visits.length > 0 && 
    bill.visits.every(visit => visit.icdCodes.length > 0 && visit.cptCodes.length > 0)
  );
  
  if (hasAllInfo) {
    // Double check if individual visits are all completed
    const allVisitsCompleted = superbills.every(bill =>
      bill.visits.every(visit => !visit.status || visit.status === 'completed')
    );
    
    return allVisitsCompleted ? "Complete" : "Missing Info";
  }
  
  // Check if any visits are missing codes or fees
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

export function useGroupedSubmission() {
  const navigate = useNavigate();
  const { patients } = usePatient();
  const { superbills, updateSuperbill } = useSuperbill();
  
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [patientsWithSuperbills, setPatientsWithSuperbills] = useState<PatientWithSuperbills[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCoverSheet, setShowCoverSheet] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(true);
  const [coverLetterContent, setCoverLetterContent] = useState("");
  const [isCoverLetterDialogOpen, setIsCoverLetterDialogOpen] = useState(false);
  
  // Process patients and their superbills
  useEffect(() => {
    const processed: PatientWithSuperbills[] = patients.map(patient => {
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
      
      // Calculate the status with our helper function that returns the correct type
      const status = determineStatus(patientSuperbills);
      
      return {
        ...patient,
        superbills: patientSuperbills,
        totalVisits,
        totalAmount,
        status,
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
  
  // Handle status change
  const handleStatusChange = (id: string, newStatus: SuperbillStatus) => {
    // Find the superbill to update
    const superbill = superbills.find(bill => bill.id === id);
    if (!superbill) return;
    
    // Update the superbill status
    updateSuperbill({
      ...superbill,
      status: newStatus
    });
  };
  
  // Handle preview cover letter
  const handlePreviewCoverLetter = () => {
    // Generate cover letter content before opening dialog
    if (selectedSuperbills.length > 0) {
      // Fixed: Pass the second parameter (includeInvoiceNote) as true
      const generatedContent = generateCoverLetterFromSuperbills(selectedSuperbills, true);
      setCoverLetterContent(generatedContent);
    }
    setIsCoverLetterDialogOpen(true);
  };
  
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
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              line-height: 1.5;
            }
            p {
              margin: 0 0 10px 0;
            }
            h1, h2, h3 {
              margin: 15px 0;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .cover-letter {
              margin-bottom: 30px;
              padding-bottom: 20px;
            }
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .info-block {
              width: 48%;
            }
            .clinic-info {
              margin-bottom: 20px;
            }
            .clinic-info p {
              margin: 3px 0;
            }
            ul, ol {
              padding-left: 25px;
            }
            li {
              margin-bottom: 8px;
            }
            .patient-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
            .patient-card {
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
    `;
    
    // Add cover letter if enabled
    if (showCoverLetter && selectedSuperbills.length > 0) {
      completeHtml += `<div class="container cover-letter">${coverLetterContent}</div><div class="page-break"></div>`;
    }
    
    // Add cover sheet if enabled
    if (showCoverSheet && selectedSuperbills.length > 0) {
      // Fixed: Pass the includeInvoiceNote parameter (true as default)
      const coverSheetHtml = generateCoverSheetHtml(selectedSuperbills, true);
      completeHtml += `<div class="container">${coverSheetHtml}</div><div class="page-break"></div>`;
    }
    
    // Add each superbill
    selectedSuperbills.forEach((superbill, index) => {
      const superbillHtml = generatePrintableHTML(superbill);
      // Extract the body content from the superbill HTML
      const bodyContent = superbillHtml.match(/<body>([\s\S]*)<\/body>/)?.[1] || '';
      completeHtml += `<div class="container">${bodyContent}</div>`;
      
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

  return {
    navigate,
    selectedPatientIds,
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,
    showCoverSheet,
    setShowCoverSheet,
    showCoverLetter,
    setShowCoverLetter,
    coverLetterContent,
    setCoverLetterContent,
    isCoverLetterDialogOpen,
    setIsCoverLetterDialogOpen,
    filteredPatients,
    selectedPatients,
    selectedSuperbills,
    togglePatientSelection,
    clearSelection,
    selectAll,
    handleStatusChange,
    handlePreviewCoverLetter,
    handleDownloadAll
  };
}
