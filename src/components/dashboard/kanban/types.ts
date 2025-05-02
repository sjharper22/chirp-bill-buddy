import { Superbill, SuperbillStatus } from "@/types/superbill";
import { LucideIcon } from "lucide-react";

export type StatusVariant = "default" | "success" | "warning" | "info" | "error";

export interface KanbanColumn {
  id: SuperbillStatus;
  title: string;
  description: string;
  icon: LucideIcon;
  variant: StatusVariant;
  count?: number;
  bgColor?: string;
  superbills?: Superbill[];
}

export interface KanbanHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectionMode?: boolean;
  toggleSelectionMode?: () => void;
  selectedCount?: number;
  onAddSelectedToPatients?: () => void;
  onFilterChange?: (status: SuperbillStatus | "all") => void;
  onSortChange?: (order: "asc" | "desc") => void;
  currentFilter?: SuperbillStatus | "all";
  currentSort?: "asc" | "desc";
}

export interface KanbanCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  isPatientSelected?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  availableStatuses?: KanbanColumn[];
  currentStatus?: SuperbillStatus;
}

export interface KanbanColumnProps {
  column: KanbanColumn;
  superbills: Superbill[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  selectedPatientIds?: string[];
  allColumns?: KanbanColumn[];
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, newStatus: SuperbillStatus) => void;
  handleDragStart?: (e: React.DragEvent, id: string) => void;
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
