
import { Superbill } from "@/types/superbill";

export interface SuperbillCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

export interface CardHeaderProps {
  patientName: string;
  issueDate: Date;
  status: string;
  statusVariant: 'default' | 'success' | 'warning' | 'info' | 'error';
}

export interface PatientInfoProps {
  patientDob: Date;
  visitDates: {
    earliestDate: Date | null;
    latestDate: Date | null;
  };
  complaints: string[];
}

export interface CardStatsProps {
  visitCount: number;
  totalFee: number;
}

export interface CardActionsProps {
  superbillId: string;
  onDelete: (id: string) => void;
}
