
import { Superbill, SuperbillStatus } from "@/types/superbill";

export interface RecentSuperbillsProps {
  filteredSuperbills: Superbill[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  totalSuperbills: number;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  selectedPatientIds?: string[];
  selectionMode?: boolean;
  toggleSelectionMode?: () => void;
  onAddSelectedToPatients?: () => void;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  expandSearch: boolean;
  setExpandSearch: (value: boolean) => void;
}

export interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: SuperbillStatus | "all";
  setStatusFilter: (status: SuperbillStatus | "all") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  isCompactView: boolean;
  onViewModeToggle: () => void;
  selectionMode?: boolean;
  selectedPatientIds?: string[];
  toggleSelectionMode?: () => void;
  onAddSelectedToPatients?: () => void;
}

export interface EmptyStateProps {
  statusFilter: SuperbillStatus | "all";
  navigateToNew: () => void;
}
