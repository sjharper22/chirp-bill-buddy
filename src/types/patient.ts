
import { Visit } from "./superbill";

export interface PatientProfile {
  id: string;
  name: string;
  dob: Date;
  lastSuperbillDate?: Date;
  lastSuperbillDateRange?: {
    start: Date;
    end: Date;
  };
  commonIcdCodes: string[];
  commonCptCodes: string[];
  visits?: Visit[];
  notes?: string;
}

export type PatientProfileFormData = Omit<PatientProfile, "id">;
