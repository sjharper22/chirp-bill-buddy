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
      // Validate patient data
      if (!patient.name || patient.name.trim() === '') {
        throw new Error("Patient name is required");
      }
      
      if (!(patient.dob instanceof Date) || isNaN(patient.dob.getTime())) {
        throw new Error("Valid date of birth is required");
      }

      // First check if patient with same name exists in database or locally
      let existingDbPatient = null;
      try {
        existingDbPatient = await patientService.getByName(patient.name);
      } catch (err) {
        console.error("Error checking for existing patient:", err);
        // Continue with operation even if check fails
      }
      
      const existingLocalPatient = currentPatients.find(p => p.name === patient.name);
      
      if (existingDbPatient) {
        console.log("Patient already exists in database:", existingDbPatient);
        toast({
          title: "Notice",
          description: `Patient "${patient.name}" already exists in the database.`,
        });
        return existingDbPatient;
      }
      
      if (existingLocalPatient) {
        console.log("Patient already exists locally:", existingLocalPatient);
        toast({
          title: "Notice",
          description: `Patient "${patient.name}" already exists locally.`,
        });
        return existingLocalPatient;
      }
      
      // Ensure arrays are initialized
      const patientData = {
        ...patient,
        commonIcdCodes: patient.commonIcdCodes || [],
        commonCptCodes: patient.commonCptCodes || [],
      };
      
      // Create in database
      console.log("Creating patient in database:", patientData);
      try {
        // Keep track of the notes value but don't send it to the database
        const notes = patientData.notes;
        
        // Create patient in database (notes field is handled in the mapper)
        const newPatient = await patientService.create(patientData);
        
        // Make sure notes are preserved in our local representation
        if (notes) {
          newPatient.notes = notes;
        }
        
        console.log("Patient created in database:", newPatient);
        
        toast({
          title: "Success",
          description: `Patient "${patient.name}" created successfully.`,
        });
        
        return newPatient;
      } catch (dbError: any) {
        console.error("Database error creating patient:", dbError);
        
        // Fall back to local creation only as last resort
        const localPatient = { ...patientData, id: generateId() };
        toast({
          title: "Warning",
          description: `Patient "${patient.name}" saved locally but couldn't be saved to database. Some features may not work correctly.`,
          variant: "destructive",
        });
        
        return localPatient;
      }
    } catch (error: any) {
      console.error("Error in patient actions - addPatient:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add patient",
        variant: "destructive",
      });
      
      throw error; // Re-throw the error for further handling
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
      console.log(`Updating patient: ${id}`, updatedPatient);
      
      // Save notes locally but don't send to database
      const notes = updatedPatient.notes;
      
      // Update in database first (notes field is handled in the mapper)
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
        description: `Patient "${updatedPatient.name}" updated locally but couldn't be updated in database.`,
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
    patientName: string,
    toast: ToastFn
  ): Promise<void> {
    try {
      console.log(`Deleting patient: ${id} (${patientName})`);
      
      // Delete from database first
      await patientService.delete(id);
      console.log("Patient deleted from database");
      
      toast({
        title: "Success",
        description: `Patient "${patientName}" deleted successfully.`,
      });
    } catch (dbError: any) {
      console.error("Database error deleting patient:", dbError);
      toast({
        title: "Warning",
        description: `Patient "${patientName}" removed locally but couldn't be deleted from database.`,
        variant: "destructive",
      });
      
      throw dbError;
    }
  }
};
