
import { PatientProfile } from "@/types/patient";
import { patientActions } from "../patient-actions";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

/**
 * Hook for patient creation, update, and deletion operations
 */
export function usePatientCrud(
  patients: PatientProfile[],
  setPatients: React.Dispatch<React.SetStateAction<PatientProfile[]>>,
  clearPatientSelection: () => void,
  refreshPatients?: () => Promise<PatientProfile[]>,
  providedToast?: ReturnType<typeof useToast>
) {
  const defaultToast = useToast();
  const toast = providedToast || defaultToast;
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Creates a new patient profile
   * @param patient Patient data without ID
   * @returns The created patient with ID
   */
  const addPatient = async (patient: Omit<PatientProfile, "id">): Promise<PatientProfile> => {
    if (isProcessing) {
      console.log("Operation already in progress, skipping");
      throw new Error("An operation is already in progress");
    }
    
    setIsProcessing(true);
    try {
      console.log("Starting addPatient with data:", patient);
      
      // Create the patient using the service
      const newPatient = await patientActions.addPatient(patient, patients, toast.toast);
      console.log("Patient added successfully:", newPatient);
      
      // Update local state if the patient was created successfully
      setPatients(prevPatients => {
        // Check if patient with this ID already exists to prevent duplicates
        const exists = prevPatients.some(p => p.id === newPatient.id);
        if (exists) return prevPatients;
        return [...prevPatients, newPatient];
      });
      
      // Force refresh from database to ensure we have the latest data
      if (refreshPatients) {
        try {
          console.log("Refreshing patients after adding...");
          await refreshPatients();
          console.log("Patient refresh complete");
        } catch (refreshError) {
          console.error("Could not refresh patients after adding:", refreshError);
          // Continue with operation even if refresh fails
        }
      }
      
      return newPatient;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error in addPatient:", errorMessage);
      
      toast.toast({
        title: "Error",
        description: `Failed to add patient: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error; // Re-throw to allow caller to handle
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Updates an existing patient profile
   * @param id Patient ID
   * @param updatedPatient Updated patient data
   */
  const updatePatient = async (id: string, updatedPatient: PatientProfile): Promise<void> => {
    if (isProcessing) {
      console.log("Operation already in progress, skipping");
      throw new Error("An operation is already in progress");
    }
    
    setIsProcessing(true);
    try {
      // Update the patient in the database
      await patientActions.updatePatient(id, updatedPatient, toast.toast);
      console.log("Patient updated successfully:", updatedPatient);
      
      // Update local state if successful
      setPatients(prevPatients => 
        prevPatients.map(patient => patient.id === id ? updatedPatient : patient)
      );
      
      // Force refresh from database to ensure we have the latest data
      if (refreshPatients) {
        try {
          console.log("Refreshing patients after updating...");
          await refreshPatients();
        } catch (refreshError) {
          console.error("Could not refresh patients after updating:", refreshError);
          // Continue with operation even if refresh fails
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error in updatePatient:", errorMessage);
      
      toast.toast({
        title: "Error",
        description: `Failed to update patient: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error; // Re-throw to allow caller to handle
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Deletes a patient profile
   * @param id Patient ID to delete
   */
  const deletePatient = async (id: string): Promise<void> => {
    if (isProcessing) {
      console.log("Operation already in progress, skipping");
      throw new Error("An operation is already in progress");
    }
    
    setIsProcessing(true);
    try {
      // Find the patient to get the name for the toast message
      const patientToDelete = patients.find(p => p.id === id);
      if (!patientToDelete) {
        throw new Error("Patient not found");
      }
      
      const patientName = patientToDelete?.name || 'Unknown patient';
      
      // Delete from database
      await patientActions.deletePatient(id, patientName, toast.toast);
      console.log("Patient deleted successfully:", id);
      
      // Update local state if successful
      setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
      
      // Clean up selected patient IDs
      clearPatientSelection();
      
      // Force refresh from database to ensure we have the latest data
      if (refreshPatients) {
        try {
          console.log("Refreshing patients after deleting...");
          await refreshPatients();
        } catch (refreshError) {
          console.error("Could not refresh patients after deleting:", refreshError);
          // Continue with operation even if refresh fails
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error in deletePatient:", errorMessage);
      
      toast.toast({
        title: "Error",
        description: `Failed to delete patient: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error; // Re-throw to allow caller to handle
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    addPatient,
    updatePatient,
    deletePatient,
    isProcessing
  };
}
