
import { ClipboardCheck, ClipboardList, FileEdit, FileText } from "lucide-react";
import { KanbanColumn } from "./types";

export const kanbanColumns: KanbanColumn[] = [
  {
    id: "draft",
    title: "Draft",
    icon: FileText,
    description: "Not yet started",
    bgColor: "bg-blue-50"
  },
  {
    id: "in_progress",
    title: "In Progress",
    icon: FileEdit,
    description: "Being worked on",
    bgColor: "bg-amber-50"
  },
  {
    id: "in_review",
    title: "In Review",
    icon: ClipboardList,
    description: "Ready for review",
    bgColor: "bg-purple-50"
  },
  {
    id: "completed",
    title: "Completed",
    icon: ClipboardCheck,
    description: "Ready for submission",
    bgColor: "bg-green-50"
  }
];
