
import { PatientProfile } from "@/types/patient";
import { patientActions } from "../patient-actions";
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook for patient CRUD operations with proper error handling and database synchronization
 * 
 * @param patients - Current list of patients
 * @param setPatients - State setter for patients
 * @param clearPatientSelection - Function to clear selected patients
 * @param refreshPatients - Function to refresh patients from database
 * @returns Object containing CRUD operations for patients
 */
export function usePatientOperations(
  patients: PatientProfile[],
  setPatients: React.Dispatch<React.SetStateAction<PatientProfile[]>>,
  clearPatientSelection: () => void,
  refreshPatients?: () => Promise<PatientProfile[]>
) {
  const { toast } = useToast();
  
  /**
   * Creates a new patient profile
   * @param patient Patient data without ID
   * @returns The created patient with ID
   */
  const addPatient = async (patient: Omit<PatientProfile, "id">): Promise<PatientProfile> => {
    try {
      // Create the patient using the service
      const newPatient = await patientActions.addPatient(patient, patients, toast);
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
          const refreshedPatients = await refreshPatients();
          console.log(`Refreshed ${refreshedPatients.length} patients from database`);
          // No need to setPatients here as refreshPatients will do that
        } catch (refreshError) {
          console.error("Could not refresh patients after adding:", refreshError);
        }
      }
      
      return newPatient;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error in addPatient:", errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to add patient: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error; // Re-throw to allow caller to handle
    }
  };

  /**
   * Updates an existing patient profile
   * @param id Patient ID
   * @param updatedPatient Updated patient data
   */
  const updatePatient = async (id: string, updatedPatient: PatientProfile): Promise<void> => {
    try {
      // Update the patient in the database
      await patientActions.updatePatient(id, updatedPatient, toast);
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
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error in updatePatient:", errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to update patient: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error; // Re-throw to allow caller to handle
    }
  };

  /**
   * Deletes a patient profile
   * @param id Patient ID to delete
   */
  const deletePatient = async (id: string): Promise<void> => {
    try {
      // Find the patient to get the name for the toast message
      const patientToDelete = patients.find(p => p.id === id);
      const patientName = patientToDelete?.name || 'Unknown patient';
      
      // Delete from database
      await patientActions.deletePatient(id, patientName, toast);
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
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error in deletePatient:", errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to delete patient: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error; // Re-throw to allow caller to handle
    }
  };

  /**
   * Gets a patient by ID or name
   * @param idOrName Patient ID or full name
   * @returns The patient profile or undefined if not found
   */
  const getPatient = (idOrName: string): PatientProfile | undefined => {
    // First try to find by ID (exact match)
    let patient = patients.find(patient => patient.id === idOrName);
    
    // If not found by ID, try to find by name (exact match)
    if (!patient) {
      patient = patients.find(patient => patient.name === idOrName);
    }
    
    return patient;
  };

  return {
    addPatient,
    updatePatient,
    deletePatient,
    getPatient
  };
}
