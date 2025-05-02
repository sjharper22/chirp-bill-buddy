
import { PatientProfile } from "@/types/patient";
import { patientActions } from "../patient-actions";
import { useToast } from "@/components/ui/use-toast";

type ToastFn = (props: { title: string; description: string; variant?: "default" | "destructive" }) => void;

export function usePatientOperations(
  patients: PatientProfile[],
  setPatients: React.Dispatch<React.SetStateAction<PatientProfile[]>>,
  setSelectedPatientIds: React.Dispatch<React.SetStateAction<string[]>>
) {
  const { toast } = useToast();
  
  const addPatient = async (patient: Omit<PatientProfile, "id">): Promise<PatientProfile> => {
    try {
      const newPatient = await patientActions.addPatient(patient, patients, toast);
      
      // Add to local state - ensure we don't cause a duplicate
      setPatients(prev => {
        // Check if patient with this ID already exists
        const exists = prev.some(p => p.id === newPatient.id);
        if (exists) {
          return prev;
        }
        return [...prev, newPatient];
      });
      
      return newPatient;
    } catch (error: any) {
      console.error("Error in addPatient:", error);
      toast({
        title: "Error",
        description: `Failed to add patient: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePatient = async (id: string, updatedPatient: PatientProfile): Promise<void> => {
    try {
      await patientActions.updatePatient(id, updatedPatient, toast);
      
      // Update local state
      setPatients(prev => prev.map(patient => patient.id === id ? updatedPatient : patient));
    } catch (error: any) {
      console.error("Error in updatePatient:", error);
      toast({
        title: "Error",
        description: `Failed to update patient: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePatient = async (id: string): Promise<void> => {
    try {
      await patientActions.deletePatient(id, toast);
      
      // Delete from local state
      setPatients(prev => prev.filter(patient => patient.id !== id));
      setSelectedPatientIds(prev => prev.filter(patientId => patientId !== id));
    } catch (error: any) {
      console.error("Error in deletePatient:", error);
      toast({
        title: "Error",
        description: `Failed to delete patient: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getPatient = (idOrName: string) => {
    // First try to find patient by ID
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
