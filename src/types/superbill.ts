
export interface Visit {
  id: string;
  date: Date;
  icdCodes: string[];
  cptCodes: string[];
  fee: number;
  notes?: string;
}

export interface Superbill {
  id: string;
  patientName: string;
  patientDob: Date;
  issueDate: Date;
  dateRangeStart: Date;
  dateRangeEnd: Date;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  ein: string;
  npi: string;
  providerName: string;
  defaultIcdCodes: string[];
  defaultCptCodes: string[];
  defaultFee: number;
  visits: Visit[];
  createdAt: Date;
  updatedAt: Date;
}

export type SuperbillFormData = Omit<Superbill, "id" | "createdAt" | "updatedAt">;

export interface ClinicDefaults {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  ein: string;
  npi: string;
  providerName: string;
  defaultIcdCodes: string[];
  defaultCptCodes: string[];
  defaultFee: number;
}
