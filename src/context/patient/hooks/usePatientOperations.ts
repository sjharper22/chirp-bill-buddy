
import { PatientProfile } from "@/types/patient";
import { patientActions } from "../patient-actions";
import { useToast } from "@/components/ui/use-toast";
import { ToastType } from "../types";

/**
 * Hook for patient CRUD operations with proper error handling
 */
export function usePatientOperations(
  patients: PatientProfile[],
  setPatients: React.Dispatch<React.SetStateAction<PatientProfile[]>>,
  clearPatientSelection: () => void
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
      
      // Update local state if the patient was created successfully
      setPatients(prev => {
        // Check if patient with this ID already exists to prevent duplicates
        const exists = prev.some(p => p.id === newPatient.id);
        if (exists) return prev;
        return [...prev, newPatient];
      });
      
      return newPatient;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error in addPatient:", errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to add patient: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error;
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
      
      // Update local state if successful
      setPatients(prev => prev.map(patient => 
        patient.id === id ? updatedPatient : patient
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error in updatePatient:", errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to update patient: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  /**
   * Deletes a patient profile
   * @param id Patient ID to delete
   */
  const deletePatient = async (id: string): Promise<void> => {
    try {
      // Delete from database
      await patientActions.deletePatient(id, toast);
      
      // Update local state if successful
      setPatients(prev => prev.filter(patient => patient.id !== id));
      
      // Clean up selected patient IDs
      clearPatientSelection();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error in deletePatient:", errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to delete patient: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error;
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
