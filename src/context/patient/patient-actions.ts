
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
    
    // First check if patient with same name exists in database
    const existingPatient = await patientService.getByName(patient.name);
    
    if (existingPatient) {
      console.log("Patient already exists in database:", existingPatient);
      return existingPatient;
    }
    
    // Create in database first to get the ID
    let newPatient: PatientProfile;
    try {
      newPatient = await patientService.create(patient);
      console.log("Patient created in database:", newPatient);
    } catch (dbError: any) {
      console.error("Database error creating patient:", dbError);
      // Fall back to local creation if database fails
      newPatient = { ...patient, id: generateId() };
      toast({
        title: "Warning",
        description: "Patient saved locally but couldn't be saved to database. Some features may not work correctly.",
        variant: "destructive",
      });
    }
    
    return newPatient;
  },
  
  async updatePatient(
    id: string, 
    updatedPatient: PatientProfile,
    toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void
  ): Promise<void> {
    // Update in database first
    try {
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
    // Delete from database first
    try {
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
