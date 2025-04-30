
import { ClipboardCheck, ClipboardList, FileEdit, FileText } from "lucide-react";
import { KanbanColumn } from "./types";

export const kanbanColumns: KanbanColumn[] = [
  {
    id: "draft",
    title: "Draft",
    icon: FileText,
    description: "Not yet started",
    variant: "info"
  },
  {
    id: "in_progress",
    title: "In Progress",
    icon: FileEdit,
    description: "Being worked on",
    variant: "warning"
  },
  {
    id: "in_review",
    title: "In Review",
    icon: ClipboardList,
    description: "Ready for review",
    variant: "info"
  },
  {
    id: "completed",
    title: "Completed",
    icon: ClipboardCheck,
    description: "Ready for submission",
    variant: "success"
  }
];
