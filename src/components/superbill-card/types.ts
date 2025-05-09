
import { SuperbillStatus } from "@/types/superbill";
import { LucideIcon } from "lucide-react";
import { Superbill } from "@/types/superbill";

export interface PatientInfoProps {
  patientDob: Date | string;
  visitDates: {
    earliestDate: Date | string | null;
    latestDate: Date | string | null;
  };
  complaints: string[];
  isExpanded: boolean;
}

export interface CardHeaderProps {
  patientName: string;
  issueDate: Date | string;
  status: string;
  statusVariant: "default" | "info" | "success" | "warning" | "error" | "danger";
  onStatusChange?: (newStatus: SuperbillStatus) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export interface CardStatsProps {
  visitCount: number;
  totalFee: number;
}

export interface CardActionsProps {
  superbillId: string;
  onDelete: (id: string) => void;
  isCollapsed?: boolean;
  isExpanded: boolean;
}

export interface SuperbillCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onClick?: () => void;
  onSelectPatient?: (id: string) => void;
  isPatientSelected?: boolean;
  onStatusChange?: (id: string, newStatus: SuperbillStatus) => void;
  isCollapsed?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
}

export interface StatusSelectorProps {
  currentStatus: SuperbillStatus;
  onStatusChange: (newStatus: SuperbillStatus) => void;
}

export interface ViewModeToggleProps {
  isCompactView: boolean;
  onToggle: () => void;
}
