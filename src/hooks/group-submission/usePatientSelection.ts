
import { useState } from "react";
import { PatientWithSuperbills } from "@/components/group-submission/types";

export function usePatientSelection() {
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  
  // Handle selection
  const togglePatientSelection = (id: string) => {
    setSelectedPatientIds(prev => 
      prev.includes(id) 
        ? prev.filter(patientId => patientId !== id) 
        : [...prev, id]
    );
  };
  
  const selectAll = (filteredPatients: PatientWithSuperbills[]) => {
    setSelectedPatientIds(filteredPatients.map(patient => patient.id));
  };
  
  const clearSelection = () => {
    setSelectedPatientIds([]);
  };
  
  // Get selected patients and their superbills
  const getSelectedPatients = (filteredPatients: PatientWithSuperbills[]) => {
    return filteredPatients.filter(patient => 
      selectedPatientIds.includes(patient.id)
    );
  };
  
  return {
    selectedPatientIds,
    togglePatientSelection,
    selectAll,
    clearSelection,
    getSelectedPatients
  };
}
