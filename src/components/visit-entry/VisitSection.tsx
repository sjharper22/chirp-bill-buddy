
import { VisitSection as VisitSectionType } from "@/hooks/useVisitSections";
import { Visit } from "@/types/superbill";
import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

interface VisitSectionProps {
  section: VisitSectionType;
  index: number;
  draggingSection: number | null;
  setDraggingSection: (index: number | null) => void;
  moveSection: (from: number, to: number) => void;
  children: ReactNode;
}

export function VisitSection({
  section,
  index,
  draggingSection,
  setDraggingSection,
  moveSection,
  children
}: VisitSectionProps) {
  return (
    <div
      key={section}
      draggable
      onDragStart={(e) => {
        setDraggingSection(index);
        e.currentTarget.style.opacity = '0.5';
      }}
      onDragEnd={(e) => {
        setDraggingSection(null);
        e.currentTarget.style.opacity = '1';
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.style.borderTop = draggingSection !== null && draggingSection !== index 
          ? '2px solid #4f46e5' 
          : '';
      }}
      onDragLeave={(e) => {
        e.currentTarget.style.borderTop = '';
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.style.borderTop = '';
        if (draggingSection !== null && draggingSection !== index) {
          moveSection(draggingSection, index);
        }
      }}
      className="flex items-center gap-2 p-2 rounded hover:bg-accent/20 transition-colors"
    >
      <div 
        className="cursor-move p-1 hover:bg-accent/30 rounded"
        onMouseDown={(e) => e.preventDefault()}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}
