
import { PatientProfile } from "@/types/patient";

/**
 * Hook for querying patient data
 */
export function usePatientQuery(patients: PatientProfile[]) {
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
    getPatient
  };
}
