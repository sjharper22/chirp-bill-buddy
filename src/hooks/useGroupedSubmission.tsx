
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { PatientWithSuperbills } from "@/components/group-submission/types";
import { SuperbillStatus } from "@/types/superbill";
import { determineStatus } from "./group-submission/useStatusDetermination";
import { useDocumentGeneration } from "./group-submission/useDocumentGeneration";
import { usePatientSelection } from "./group-submission/usePatientSelection";
import { useFilterSearch } from "./group-submission/useFilterSearch";

export function useGroupedSubmission() {
  const navigate = useNavigate();
  const { patients } = usePatient();
  const { superbills, updateSuperbill } = useSuperbill();
  
  // Import functionality from our new modules
  const { 
    showCoverSheet, setShowCoverSheet,
    showCoverLetter, setShowCoverLetter,
    coverLetterContent, setCoverLetterContent,
    isCoverLetterDialogOpen, setIsCoverLetterDialogOpen,
    handlePreviewCoverLetter, handleDownloadAll
  } = useDocumentGeneration();
  
  const {
    selectedPatientIds, 
    togglePatientSelection,
    selectAll, 
    clearSelection,
    getSelectedPatients
  } = usePatientSelection();
  
  const {
    filterStatus, 
    setFilterStatus,
    searchTerm, 
    setSearchTerm
  } = useFilterSearch();
  
  const [patientsWithSuperbills, setPatientsWithSuperbills] = useState<PatientWithSuperbills[]>([]);
  
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
          const visitDate = new Date(visit.date);
          if (!earliestDate || visitDate < earliestDate) {
            earliestDate = visitDate;
          }
          if (!latestDate || visitDate > latestDate) {
            latestDate = visitDate;
          }
        });
      });
      
      // Set date range if we found valid dates
      const dateRange = (earliestDate && latestDate)
        ? { start: earliestDate, end: latestDate }
        : null;
      
      // Calculate the status with our helper function
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
  
  // Get selected patients and their superbills
  const selectedPatients = getSelectedPatients(filteredPatients);
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
  
  // Custom handler that uses the imported handlePreviewCoverLetter function
  const previewCoverLetterHandler = () => {
    handlePreviewCoverLetter(selectedSuperbills);
  };
  
  // Custom handler that uses the imported handleDownloadAll function
  const downloadAllHandler = () => {
    handleDownloadAll(selectedSuperbills);
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
    selectAll: () => selectAll(filteredPatients),
    handleStatusChange,
    handlePreviewCoverLetter: previewCoverLetterHandler,
    handleDownloadAll: downloadAllHandler
  };
}
