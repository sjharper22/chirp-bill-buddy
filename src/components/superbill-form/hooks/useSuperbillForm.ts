
import { useState } from "react";
import { calculateTotalFee } from "@/lib/utils/superbill-utils";
import { Superbill } from "@/types/superbill";
import { PatientProfile } from "@/types/patient";
import { Visit, visitService } from "@/services/visitService";
import { useSuperbillState } from "./useSuperbillState";
import { useVisitOperations } from "./useVisitOperations";
import { useSuperbillSubmit } from "./useSuperbillSubmit";

/**
 * Main hook for superbill form functionality
 */
export function useSuperbillForm(existingSuperbill?: Superbill, prefilledPatient?: PatientProfile) {
  // Compose smaller hooks
  const { superbill, setSuperbill, updateField, isEdit } = useSuperbillState(existingSuperbill, prefilledPatient);
  const { updateVisit, addVisit, duplicateVisit, deleteVisit, updateVisitsWithDefaults } = 
    useVisitOperations(superbill, setSuperbill);
  const { handleSubmit } = useSuperbillSubmit(superbill, existingSuperbill);
  
  // Visit selection state
  const [showVisitPicker, setShowVisitPicker] = useState(false);
  const [availableVisits, setAvailableVisits] = useState<Visit[]>([]);
  const [selectedVisitIds, setSelectedVisitIds] = useState<string[]>([]);
  
  // Calculate total fee
  const totalFee = calculateTotalFee(superbill.visits);
  
  // Load available visits for a patient
  const loadAvailableVisits = async (patientId: string) => {
    try {
      const visits = await visitService.getUnbilledVisitsByPatient(patientId);
      setAvailableVisits(visits);
      return visits;
    } catch (error) {
      console.error("Failed to load visits:", error);
      return [];
    }
  };

  // Handle visit selection confirmation
  const handleVisitSelectionConfirm = (visitIds: string[]) => {
    const selectedVisits = availableVisits.filter(v => visitIds.includes(v.id));
    
    // Convert database visits to superbill visit format
    const superbillVisits = selectedVisits.map(visit => ({
      id: visit.id,
      date: new Date(visit.visit_date),
      icdCodes: (visit.icd_codes as string[]) || [],
      cptCodes: (visit.cpt_codes as string[]) || [],
      mainComplaints: (visit.main_complaints as string[]) || [],
      fee: visit.fee || 0,
      notes: visit.notes || "",
      status: 'draft' as const
    }));

    // Update superbill with selected visits
    setSuperbill(prev => ({
      ...prev,
      visits: superbillVisits
    }));

    setShowVisitPicker(false);
    setSelectedVisitIds([]);
  };

  return {
    superbill,
    setSuperbill,
    handleSubmit,
    updateField,
    updateVisit,
    addVisit,
    duplicateVisit,
    deleteVisit,
    updateVisitsWithDefaults,
    totalFee,
    isEdit,
    // Visit selection functionality
    showVisitPicker,
    setShowVisitPicker,
    availableVisits,
    selectedVisitIds,
    setSelectedVisitIds,
    loadAvailableVisits,
    handleVisitSelectionConfirm
  };
}
