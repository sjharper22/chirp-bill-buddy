
import { Superbill, SuperbillStatus } from "@/types/superbill";

export interface KanbanColumn {
  id: SuperbillStatus;
  title: string;
  count: number;
  superbills: Superbill[];
  bgColor: string;
}

export interface KanbanHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectionMode?: boolean;
  toggleSelectionMode?: () => void;
  selectedCount?: number;
  onAddSelectedToPatients?: () => void;
}

export interface KanbanCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  isPatientSelected?: boolean;
}

export interface KanbanColumnProps {
  column: KanbanColumn;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  selectedPatientIds?: string[];
}
