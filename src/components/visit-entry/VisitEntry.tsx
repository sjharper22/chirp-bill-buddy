
import { useState } from "react";
import { Visit } from "@/types/superbill";
import { formatCurrency } from "@/lib/utils/superbill-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { VisitSection } from "./VisitSection";
import { VisitSectionContent } from "./VisitSectionContent";
import { VisitHeader } from "./VisitHeader";
import { useVisitSections } from "@/hooks/useVisitSections";

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
    
    onDuplicate(visit);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    onDelete(visit.id);
  };

  return (
    <Card className="mb-4">
      <VisitHeader 
        visit={visit} 
        onVisitChange={onVisitChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
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
