
import { PatientProfile } from "@/types/patient";
import { patientService } from "@/services/patientService";

export const patientStorage = {
  async syncWithDatabase(localPatients: PatientProfile[]): Promise<PatientProfile[]> {
    console.log("Syncing patients with database...");
    const dbPatients = await patientService.getAll();
    console.log("Database patients:", dbPatients);
    
    // Create a map of existing patients by ID for quick lookup
    const patientsMap = new Map<string, PatientProfile>();
    localPatients.forEach(patient => {
      patientsMap.set(patient.id, patient);
    });
    
    // Add database patients that don't exist locally
    dbPatients.forEach(dbPatient => {
      if (!patientsMap.has(dbPatient.id)) {
        patientsMap.set(dbPatient.id, dbPatient);
      }
    });
    
    // Convert back to array and update state
    const mergedPatients = Array.from(patientsMap.values());
    
    console.log("Merged patients:", mergedPatients);
    return mergedPatients;
  },

  async refreshFromDatabase(): Promise<PatientProfile[]> {
    console.log("Refreshing patients from database...");
    const dbPatients = await patientService.getAll();
    console.log("Database patients:", dbPatients);
    return dbPatients;
  }
};
