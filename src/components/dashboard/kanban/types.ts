
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { LucideIcon } from "lucide-react";

export interface KanbanColumn {
  id: SuperbillStatus;
  title: string;
  icon: LucideIcon;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error';
}

export interface KanbanDragItem {
  id: string;
  status: SuperbillStatus;
}

export interface KanbanBoardProps {
  superbills: Superbill[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SuperbillStatus) => void;
}

export interface KanbanColumnProps {
  column: KanbanColumn;
  superbills: Superbill[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SuperbillStatus) => void;
  allColumns: KanbanColumn[];
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: SuperbillStatus) => void;
  handleDragStart: (e: React.DragEvent, id: string) => void;
}

export interface KanbanCardProps {
  superbill: Superbill;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onStatusChange: (id: string, status: SuperbillStatus) => void;
  availableStatuses: KanbanColumn[];
  currentStatus: SuperbillStatus;
}

export interface KanbanHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}
