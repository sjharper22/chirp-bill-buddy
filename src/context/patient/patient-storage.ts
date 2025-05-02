
import { PatientProfile } from "@/types/patient";
import { patientService } from "@/services/patient";

export const patientStorage = {
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
      // This shouldn't generally happen but provides a safeguard
      localPatients.forEach(patient => {
        if (!patientsMap.has(patient.id)) {
          console.log("Found local patient not in database, will be added:", patient);
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

  async refreshFromDatabase(): Promise<PatientProfile[]> {
    console.log("Refreshing patients from database...");
    const dbPatients = await patientService.getAll();
    console.log("Database patients:", dbPatients);
    return dbPatients;
  }
};
