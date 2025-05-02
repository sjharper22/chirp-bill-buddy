
import { useState } from "react";

export function usePatientSelection(patients: any[]) {
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);

  const togglePatientSelection = (id: string) => {
    setSelectedPatientIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(patientId => patientId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectAllPatients = () => {
    setSelectedPatientIds(patients.map(patient => patient.id));
  };

  const clearPatientSelection = () => {
    setSelectedPatientIds([]);
  };

  return {
    selectedPatientIds,
    togglePatientSelection,
    selectAllPatients,
    clearPatientSelection
  };
}
