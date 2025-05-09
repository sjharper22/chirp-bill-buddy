
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
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  isPatientSelected?: boolean;
  onStatusChange?: (id: string, newStatus: SuperbillStatus) => void;
  isCollapsed?: boolean;
  defaultExpanded?: boolean;
}

export interface StatusSelectorProps {
  currentStatus: SuperbillStatus;
  onStatusChange: (newStatus: SuperbillStatus) => void;
}

export interface KanbanBoardProps {
  superbills: Superbill[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  selectedPatientIds?: string[];
  selectionMode?: boolean;
}

export interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    icon: LucideIcon;
    description?: string;
  };
  superbills: Superbill[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  allColumns: Array<{
    id: string;
    title: string;
    icon: LucideIcon;
    description?: string;
  }>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, newStatus: SuperbillStatus) => void;
  handleDragStart: (e: React.DragEvent, id: string) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  selectedPatientIds?: string[];
  sidebarState: "expanded" | "collapsed";
}

export interface KanbanCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  isPatientSelected?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  availableStatuses?: Array<{
    id: string;
    title: string;
    icon: LucideIcon;
    description?: string;
  }>;
  currentStatus?: SuperbillStatus;
  isCollapsed?: boolean;
}

export interface KanbanHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectionMode?: boolean;
  selectedCount?: number;
  onFilterChange: (status: SuperbillStatus | "all") => void;
  onSortChange: (order: "asc" | "desc") => void;
  currentFilter: SuperbillStatus | "all";
  currentSort: "asc" | "desc";
  viewMode?: "compact" | "detailed";
  onViewModeChange?: (mode: "compact" | "detailed") => void;
}

export interface CardViewToggleProps {
  viewMode: "compact" | "detailed";
  onChange: (mode: "compact" | "detailed") => void;
}
