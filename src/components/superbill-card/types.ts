
import { Superbill, SuperbillStatus } from "@/types/superbill";

export interface SuperbillCardProps {
  superbill: Superbill;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  isPatientSelected?: boolean;
  onStatusChange?: (id: string, newStatus: SuperbillStatus) => void;
  isMobile?: boolean;
}

export interface CardHeaderProps {
  patientName: string;
  issueDate: Date;
  status: SuperbillStatus;
  statusVariant: string;
  onStatusChange?: (newStatus: SuperbillStatus) => void;
  compact?: boolean;
}

export interface PatientInfoProps {
  patientDob: Date;
  visitDates: {
    earliestDate: Date | null;
    latestDate: Date | null;
  };
  complaints: string[];
  compact?: boolean;
}

export interface CardStatsProps {
  visitCount: number;
  totalFee: number;
}

export interface CardActionsProps {
  superbillId: string;
  onDelete?: (id: string) => void;
  compact?: boolean;
}
