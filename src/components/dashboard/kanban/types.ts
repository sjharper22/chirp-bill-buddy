
import { SuperbillStatus } from "@/types/superbill";
import { LucideIcon } from "lucide-react";
import { Superbill } from "@/types/superbill";

export interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    icon: LucideIcon;
    description?: string;
  };
  superbills: Superbill[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SuperbillStatus) => void;
  onSelectPatient?: (id: string) => void;
  selectedPatientIds?: string[];
  allColumns: {
    id: string;
    title: string;
    icon: LucideIcon;
    description?: string;
  }[];
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: SuperbillStatus) => void;
  handleDragStart: (e: React.DragEvent, id: string) => void;
  sidebarState?: "expanded" | "collapsed";
  expandedCardIds?: string[];
  onToggleCardExpand?: (id: string) => void;
  isCompactView?: boolean;
}

export interface KanbanCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SuperbillStatus) => void;
  onSelectPatient?: (id: string) => void;
  isPatientSelected?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  availableStatuses?: {
    id: string;
    title: string;
    icon: LucideIcon;
  }[];
  currentStatus?: SuperbillStatus;
  isCollapsed?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
}

export interface KanbanBoardProps {
  superbills: Superbill[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  onSelectPatient?: (id: string) => void;
  selectedPatientIds?: string[];
  selectionMode?: boolean;
}

export interface KanbanHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectionMode?: boolean;
  selectedCount?: number;
  toggleSelectionMode?: () => void;
  onAddSelectedToPatients?: () => void;
  onFilterChange?: (status: SuperbillStatus | "all") => void;
  onSortChange?: (order: "asc" | "desc") => void;
  currentFilter?: SuperbillStatus | "all";
  currentSort?: "asc" | "desc";
  isCompactView?: boolean;
  onViewModeToggle?: () => void;
}

export interface KanbanColumn {
  id: string;
  title: string;
  icon: LucideIcon;
  description?: string;
  bgColor?: string;
}
