
import { calculateTotalFee } from "@/lib/utils/superbill-utils";
import { Superbill } from "@/types/superbill";
import { PatientProfile } from "@/types/patient";
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
  
  // Calculate total fee
  const totalFee = calculateTotalFee(superbill.visits);
  
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
    isEdit
  };
}
