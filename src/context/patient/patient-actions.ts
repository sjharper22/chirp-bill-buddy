
import { PatientProfile } from "@/types/patient";
import { patientService } from "@/services/patient";
import { generateId } from "@/lib/utils/superbill-utils";

export const patientActions = {
  async addPatient(
    patient: Omit<PatientProfile, "id">, 
    currentPatients: PatientProfile[],
    toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void
  ): Promise<PatientProfile> {
    console.log("Adding patient:", patient);
    
    try {
      // First check if patient with same name exists in database
      const existingPatient = await patientService.getByName(patient.name);
      
      if (existingPatient) {
        console.log("Patient already exists in database:", existingPatient);
        return existingPatient;
      }
      
      // Create in database to get the ID
      let newPatient: PatientProfile = await patientService.create(patient);
      console.log("Patient created in database:", newPatient);
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
  
  async updatePatient(
    id: string, 
    updatedPatient: PatientProfile,
    toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void
  ): Promise<void> {
    try {
      // Update in database first
      await patientService.update(id, updatedPatient);
      console.log("Patient updated in database:", updatedPatient);
    } catch (dbError: any) {
      console.error("Database error updating patient:", dbError);
      toast({
        title: "Warning",
        description: "Patient updated locally but couldn't be updated in database.",
        variant: "destructive",
      });
    }
  },
  
  async deletePatient(
    id: string,
    toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void
  ): Promise<void> {
    try {
      // Delete from database first
      await patientService.delete(id);
      console.log("Patient deleted from database");
    } catch (dbError: any) {
      console.error("Database error deleting patient:", dbError);
      toast({
        title: "Warning",
        description: "Patient removed locally but couldn't be deleted from database.",
        variant: "destructive",
      });
    }
  }
};
