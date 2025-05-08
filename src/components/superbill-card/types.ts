
import { SuperbillStatus } from "@/types/superbill";
import { LucideIcon } from "lucide-react";
import { Superbill } from "@/types/superbill";

export interface PatientInfoProps {
  patientDob: string;
  visitDates: {
    earliestDate: Date | null;
    latestDate: Date | null;
  };
  complaints: string[];
}

export interface CardHeaderProps {
  patientName: string;
  issueDate: string;
  status: string;
  statusVariant: "default" | "info" | "success" | "warning" | "danger";
  onStatusChange?: (newStatus: SuperbillStatus) => void;
}

export interface CardStatsProps {
  visitCount: number;
  totalFee: number;
}

export interface CardActionsProps {
  superbillId: string;
  onDelete: (id: string) => void;
  isCollapsed?: boolean;
}

export interface SuperbillCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onClick?: () => void;
  onSelectPatient?: (id: string) => void;
  isPatientSelected?: boolean;
  onStatusChange?: (id: string, newStatus: SuperbillStatus) => void;
  isCollapsed?: boolean;
}

export interface StatusSelectorProps {
  currentStatus: SuperbillStatus;
  onStatusChange: (newStatus: SuperbillStatus) => void;
}
