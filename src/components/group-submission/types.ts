
import { PatientProfile } from "@/types/patient";
import { Superbill } from "@/types/superbill";

export interface PatientWithSuperbills extends PatientProfile {
  superbills: Superbill[];
  totalVisits: number;
  totalAmount: number;
  status: "Complete" | "Missing Info" | "Draft" | "No Superbill";
  dateRange: { start: Date; end: Date } | null;
}
