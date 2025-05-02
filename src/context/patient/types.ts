
import { PatientProfile } from "@/types/patient";

export type ToastType = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

export interface PatientContextType {
  patients: PatientProfile[];
  loading: boolean;
  error: string | null;
  addPatient: (patient: Omit<PatientProfile, "id">) => Promise<PatientProfile>;
  updatePatient: (id: string, patient: PatientProfile) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  getPatient: (idOrName: string) => PatientProfile | undefined;
  selectedPatientIds: string[];
  togglePatientSelection: (id: string) => void;
  selectAllPatients: () => void;
  clearPatientSelection: () => void;
  refreshPatients: () => Promise<PatientProfile[]>;
  syncPatientsWithDatabase: () => Promise<PatientProfile[]>;
}
