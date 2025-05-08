import { LucideIcon } from "lucide-react";
import { SuperbillStatus, Superbill } from "@/types/superbill";
import { StatusDisplayType } from "@/components/group-submission/table/StatusBadge";

export interface KanbanColumn {
  id: SuperbillStatus;
  title: string;
  icon: LucideIcon;
  description?: string;
  bgColor?: string; // Add this property to fix kanbanConstants errors
}

export interface KanbanBoardProps {
  superbills: Superbill[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SuperbillStatus) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  selectedPatientIds?: string[];
  selectionMode?: boolean;
}

export interface KanbanColumnProps {
  superbills: Superbill[];
  column: KanbanColumn;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  selectedPatientIds?: string[];
  allColumns: KanbanColumn[];
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: SuperbillStatus) => void;
  handleDragStart: (e: React.DragEvent, id: string) => void;
  isMobile?: boolean;
}

export interface KanbanHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentFilter: SuperbillStatus | "all";
  currentSort: "asc" | "desc";
  onFilterChange: (filter: SuperbillStatus | "all") => void;
  onSortChange: (sort: "asc" | "desc") => void;
  selectionMode?: boolean;
  selectedCount?: number;
  toggleSelectionMode?: () => void; // Add this missing property
  onAddSelectedToPatients?: () => void; // Add this missing property
}

export interface KanbanCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  isPatientSelected?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  availableStatuses?: KanbanColumn[];
  currentStatus?: string;
  isMobile?: boolean;
}

export interface PatientWithSuperbills {
  id: string;
  name: string;
  dateOfBirth?: Date;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  insurance?: string;
  policyNumber?: string;
  notes?: string;
  superbills: Superbill[];
  totalVisits: number;
  totalAmount: number;
  status: "Draft" | "Complete" | "Missing Info" | "No Superbill";
  dateRange: {
    start: Date;
    end: Date;
  } | null;
}
