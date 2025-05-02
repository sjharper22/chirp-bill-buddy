
import { PatientProfile } from "@/types/patient";
import { useToast } from "@/components/ui/use-toast";
import { usePatientCrud } from "./usePatientCrud";
import { usePatientQuery } from "./usePatientQuery";

/**
 * Hook for patient CRUD operations with proper error handling and database synchronization
 */
export function usePatientOperations(
  patients: PatientProfile[],
  setPatients: React.Dispatch<React.SetStateAction<PatientProfile[]>>,
  clearPatientSelection: () => void,
  refreshPatients?: () => Promise<PatientProfile[]>,
  providedToast?: ReturnType<typeof useToast>
) {
  // Use the refactored CRUD operations hook
  const { 
    addPatient, 
    updatePatient, 
    deletePatient, 
    isProcessing 
  } = usePatientCrud(
    patients,
    setPatients,
    clearPatientSelection,
    refreshPatients,
    providedToast
  );

  // Use the query operations hook
  const { getPatient } = usePatientQuery(patients);

  return {
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    isProcessing
  };
}
