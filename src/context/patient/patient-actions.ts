
import { PatientProfile } from "@/types/patient";
import { patientService } from "@/services/patient";
import { generateId } from "@/lib/utils/superbill-utils";

// Type for toast function to ensure consistent usage
type ToastFn = (props: { 
  title: string; 
  description: string; 
  variant?: "default" | "destructive" 
}) => void;

export const patientActions = {
  /**
   * Adds a new patient to the database and state
   */
  async addPatient(
    patient: Omit<PatientProfile, "id">, 
    currentPatients: PatientProfile[],
    toast: ToastFn
  ): Promise<PatientProfile> {
    console.log("Adding patient:", patient);
    
    try {
      // First check if patient with same name exists in database
      const existingPatient = await patientService.getByName(patient.name);
      
      if (existingPatient) {
        console.log("Patient already exists in database:", existingPatient);
        toast({
          title: "Notice",
          description: `Patient "${patient.name}" already exists in the database.`,
        });
        return existingPatient;
      }
      
      // Create in database to get the ID
      let newPatient: PatientProfile = await patientService.create(patient);
      console.log("Patient created in database:", newPatient);
      
      toast({
        title: "Success",
        description: `Patient "${patient.name}" created successfully.`,
      });
      
      return newPatient;
    } catch (dbError: any) {
      console.error("Database error creating patient:", dbError);
      
      // Fall back to local creation if database fails
      const newPatient = { ...patient, id: generateId() };
      toast({
        title: "Warning",
        description: "Patient saved locally but couldn't be saved to database. Some features may not work correctly.",
        variant: "destructive",
      });
      
      return newPatient;
    }
  },
  
  /**
   * Updates an existing patient in the database and state
   */
  async updatePatient(
    id: string, 
    updatedPatient: PatientProfile,
    toast: ToastFn
  ): Promise<void> {
    try {
      // Update in database first
      await patientService.update(id, updatedPatient);
      console.log("Patient updated in database:", updatedPatient);
      
      toast({
        title: "Success",
        description: `Patient "${updatedPatient.name}" updated successfully.`,
      });
    } catch (dbError: any) {
      console.error("Database error updating patient:", dbError);
      toast({
        title: "Warning",
        description: "Patient updated locally but couldn't be updated in database.",
        variant: "destructive",
      });
      
      throw dbError;
    }
  },
  
  /**
   * Deletes a patient from the database and state
   */
  async deletePatient(
    id: string,
    toast: ToastFn
  ): Promise<void> {
    try {
      // Delete from database first
      await patientService.delete(id);
      console.log("Patient deleted from database");
      
      toast({
        title: "Success",
        description: "Patient deleted successfully.",
      });
    } catch (dbError: any) {
      console.error("Database error deleting patient:", dbError);
      toast({
        title: "Warning",
        description: "Patient removed locally but couldn't be deleted from database.",
        variant: "destructive",
      });
      
      throw dbError;
    }
  }
};
