
import { Superbill } from "@/types/superbill";

export interface CoverLetterOptions {
  patientName: string;
  totalVisits: number;
  totalCharges: number;
  visitDateRange: string;
  providerName: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  ein: string;
  npi: string;
  includeInvoiceNote?: boolean;
}

export interface PatientSummary {
  patientName: string;
  visitDates: Date[];
  totalVisits: number;
  totalCharges: number;
  visitDateRange: string;
}
