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
      // First get all patients from the database
      let dbPatients: PatientProfile[] = [];
      try {
        dbPatients = await patientService.getAll();
        console.log("Database patients:", dbPatients.length);
      } catch (dbError) {
        console.error("Failed to fetch patients from database:", dbError);
        return localPatients; // Return local patients if we can't fetch from db
      }
      
      // Create a map of existing patients by ID for quick lookup
      const patientsMap = new Map<string, PatientProfile>();
      
      // First add all database patients
      dbPatients.forEach(dbPatient => {
        if (dbPatient && dbPatient.id) {
          patientsMap.set(dbPatient.id, dbPatient);
        }
      });
      
      // Count how many patients we need to sync to database
      let syncCount = 0;
      
      // Then add any local patients that don't exist in database
      for (const patient of localPatients) {
        if (!patient.id || !patientsMap.has(patient.id)) {
          syncCount++;
          console.log("Found local patient not in database, will be added:", patient);
          try {
            // Try to create this patient in the database
            const createdPatient = await patientService.create({
              name: patient.name,
              dob: patient.dob,
              commonIcdCodes: patient.commonIcdCodes,
              commonCptCodes: patient.commonCptCodes,
              notes: patient.notes,
              lastSuperbillDate: patient.lastSuperbillDate
            });
            
            // Use the new database patient (with server-generated ID) in our map
            if (createdPatient && createdPatient.id) {
              patientsMap.set(createdPatient.id, createdPatient);
            }
          } catch (error) {
            console.error("Failed to sync local patient to database:", error);
            // If we couldn't create in database, still keep the local version
            if (patient.id) {
              patientsMap.set(patient.id, patient);
            }
          }
        }
      }
      
      // Convert back to array and return
      const mergedPatients = Array.from(patientsMap.values());
      
      console.log(`Sync complete: ${dbPatients.length} from DB, ${syncCount} local synced to DB, ${mergedPatients.length} total`);
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
      console.log("Database patients:", dbPatients.length);
      
      // Save to localStorage as backup
      if (dbPatients && dbPatients.length > 0) {
        localStorage.setItem("patients", JSON.stringify(dbPatients));
      }
      
      return dbPatients;
    } catch (error: any) {
      console.error("Error refreshing from database:", error);
      throw error; // Re-throw to allow caller to handle
    }
  },
  
  /**
   * Save patients to local storage
   */
  saveToLocalStorage(patients: PatientProfile[]): void {
    console.log("Saving patients to localStorage:", patients.length);
    try {
      localStorage.setItem("patients", JSON.stringify(patients));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }
};
