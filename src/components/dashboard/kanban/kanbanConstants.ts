
import { ClipboardCheck, ClipboardList, FileEdit, FileText } from "lucide-react";
import { KanbanColumn } from "./types";

export const kanbanColumns: KanbanColumn[] = [
  {
    id: "draft",
    title: "Draft",
    icon: FileText,
    description: "Not yet started",
    variant: "info",
    bgColor: "bg-blue-50"
  },
  {
    id: "in_progress",
    title: "In Progress",
    icon: FileEdit,
    description: "Being worked on",
    variant: "warning",
    bgColor: "bg-amber-50"
  },
  {
    id: "in_review",
    title: "In Review",
    icon: ClipboardList,
    description: "Ready for review",
    variant: "info",
    bgColor: "bg-purple-50"
  },
  {
    id: "completed",
    title: "Completed",
    icon: ClipboardCheck,
    description: "Ready for submission",
    variant: "success",
    bgColor: "bg-green-50"
  }
];
