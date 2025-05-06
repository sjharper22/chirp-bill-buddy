
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SuperbillStatus } from "@/types/superbill";
import { useDocumentGeneration } from "./group-submission/useDocumentGeneration";
import { usePatientSelection } from "./group-submission/usePatientSelection";
import { useFilterSearch } from "./group-submission/useFilterSearch";
import { usePatientProcessing } from "./group-submission/usePatientProcessing";

export function useGroupedSubmission() {
  const navigate = useNavigate();
  
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
  
  // New hook for patient processing
  const { patientsWithSuperbills } = usePatientProcessing();
  
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
    // Find the patient to modify
    // Implementation remains in useGroupedSubmission since it's directly changing state
    // and interacts with the UI controls
    const { updateSuperbill } = require("@/context/superbill-context").useSuperbill();
    const { superbills } = require("@/context/superbill-context").useSuperbill();
    
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
    handlePreviewCoverLetter(selectedSuperbills, true);
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
