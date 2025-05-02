
import { PatientProfile } from "@/types/patient";
import { patientService } from "@/services/patient";

export const patientStorage = {
  /**
   * Syncs local patients with database
   * Merges database patients with local patients and returns the merged list
   */
  async syncWithDatabase(localPatients: PatientProfile[]): Promise<PatientProfile[]> {
    console.log("Syncing patients with database...");
    try {
      const dbPatients = await patientService.getAll();
      console.log("Database patients:", dbPatients);
      
      // Create a map of existing patients by ID for quick lookup
      const patientsMap = new Map<string, PatientProfile>();
      
      // First add all database patients
      dbPatients.forEach(dbPatient => {
        patientsMap.set(dbPatient.id, dbPatient);
      });
      
      // Then add any local patients that don't exist in database
      localPatients.forEach(patient => {
        if (!patientsMap.has(patient.id)) {
          console.log("Found local patient not in database, will be added:", patient);
          try {
            // Try to create this patient in the database
            patientService.create({
              name: patient.name,
              dob: patient.dob,
              commonIcdCodes: patient.commonIcdCodes,
              commonCptCodes: patient.commonCptCodes,
              notes: patient.notes,
            }).catch(err => console.error("Failed to sync local patient to database:", err));
          } catch (error) {
            console.error("Error syncing local patient to database:", error);
          }
          patientsMap.set(patient.id, patient);
        }
      });
      
      // Convert back to array and update state
      const mergedPatients = Array.from(patientsMap.values());
      
      console.log("Merged patients:", mergedPatients);
      return mergedPatients;
    } catch (error: any) {
      console.error("Error syncing with database:", error);
      // If database sync fails, return local patients
      return localPatients;
    }
  },

  /**
   * Refreshes patients from database only
   * Gets all patients from database and returns them
   */
  async refreshFromDatabase(): Promise<PatientProfile[]> {
    console.log("Refreshing patients from database...");
    try {
      const dbPatients = await patientService.getAll();
      console.log("Database patients:", dbPatients);
      return dbPatients;
    } catch (error: any) {
      console.error("Error refreshing from database:", error);
      throw error; // Re-throw to allow caller to handle
    }
  }
};
