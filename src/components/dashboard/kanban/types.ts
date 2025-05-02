
import { LucideIcon } from "lucide-react";
import { SuperbillStatus, Superbill } from "@/types/superbill";
import { StatusDisplayType } from "@/components/group-submission/table/StatusBadge";

export interface KanbanColumn {
  id: SuperbillStatus;
  title: string;
  icon: LucideIcon;
  description?: string;
}

export interface KanbanBoardProps {
  superbills: Superbill[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SuperbillStatus) => void;
  onSelectPatient?: (id: string) => void;
  selectedPatientIds?: string[];
  selectionMode?: boolean;
}

export interface KanbanColumnProps {
  superbills: Superbill[];
  column: KanbanColumn;
  onStatusChange: (id: string, status: SuperbillStatus) => void;
  onDelete: (id: string) => void;
  allColumns: KanbanColumn[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: SuperbillStatus) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onSelectPatient?: (id: string) => void;
  selectedPatientIds?: string[];
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
  };
}
