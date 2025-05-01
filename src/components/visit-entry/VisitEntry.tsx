
import { useState } from "react";
import { Visit } from "@/types/superbill";
import { duplicateVisit } from "@/lib/utils/superbill-utils";
import { Card, CardContent } from "@/components/ui/card";
import { useVisitSections } from "@/hooks/useVisitSections";
import { VisitHeader } from "./VisitHeader";
import { VisitSection } from "./VisitSection";
import { VisitSectionContent } from "./VisitSectionContent";

interface VisitEntryProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
  onDuplicate: (visit: Visit) => void;
  onDelete: (id: string) => void;
  defaultMainComplaints?: string[];
}

export function VisitEntry({ 
  visit, 
  onVisitChange, 
  onDuplicate, 
  onDelete,
  defaultMainComplaints = []
}: VisitEntryProps) {
  const { sectionOrder, moveSection } = useVisitSections();
  const [draggingSection, setDraggingSection] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    onDuplicate(duplicateVisit(visit));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    onDelete(visit.id);
  };

  const toggleStatus = () => {
    // Cycle through statuses: draft -> in_progress -> completed -> draft
    const currentStatus = visit.status || 'draft';
    let newStatus: 'draft' | 'in_progress' | 'completed';
    
    switch (currentStatus) {
      case 'draft':
        newStatus = 'in_progress';
        break;
      case 'in_progress':
        newStatus = 'completed';
        break;
      case 'completed':
      default:
        newStatus = 'draft';
        break;
    }
    
    onVisitChange({ 
      ...visit, 
      status: newStatus
    });
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <Card className="mb-4">
      <VisitHeader 
        visit={visit}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        toggleStatus={toggleStatus}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
      
      {!isCollapsed && (
        <CardContent className="p-4">
          <div className="space-y-3">
            {sectionOrder.map((section, index) => (
              <VisitSection 
                key={section}
                section={section}
                index={index}
                draggingSection={draggingSection}
                setDraggingSection={setDraggingSection}
                moveSection={moveSection}
              >
                <VisitSectionContent 
                  section={section}
                  visit={visit}
                  onVisitChange={onVisitChange}
                  defaultMainComplaints={defaultMainComplaints}
                />
              </VisitSection>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
