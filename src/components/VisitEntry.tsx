import { useState } from "react";
import { Visit } from "@/types/superbill";
import { duplicateVisit, formatCurrency } from "@/lib/utils/superbill-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, GripVertical, Trash2 } from "lucide-react";
import { VisitDatePicker } from "@/components/visit/VisitDatePicker";
import { VisitComplaints } from "@/components/visit/VisitComplaints";
import { IcdCodeSelector } from "@/components/visit/IcdCodeSelector";
import { CptCodeSelector } from "@/components/visit/CptCodeSelector";
import { VisitNotes } from "@/components/visit/VisitNotes";
import { useVisitSections, VisitSection } from "@/hooks/useVisitSections";

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

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onVisitChange({ ...visit, fee: value });
  };

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

  const renderSection = (section: VisitSection, index: number) => {
    const sectionContent = {
      date: (
        <div className="w-full sm:w-auto">
          <VisitDatePicker visit={visit} onVisitChange={onVisitChange} />
        </div>
      ),
      complaints: (
        <div className="w-full sm:flex-1">
          <VisitComplaints 
            visit={visit} 
            onVisitChange={onVisitChange} 
            defaultMainComplaints={defaultMainComplaints} 
          />
        </div>
      ),
      codes: (
        <div className="w-full">
          <IcdCodeSelector visit={visit} onVisitChange={onVisitChange} />
          <CptCodeSelector visit={visit} onVisitChange={onVisitChange} />
        </div>
      ),
      fee: (
        <div className="w-full sm:w-auto">
          <Input
            type="number"
            placeholder="Fee"
            value={visit.fee || ""}
            onChange={handleFeeChange}
            className="w-full sm:w-[120px]"
            min={0}
            step={0.01}
          />
        </div>
      ),
      notes: (
        <div className="w-full">
          <VisitNotes visit={visit} onVisitChange={onVisitChange} />
        </div>
      )
    };

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
        {sectionContent[section]}
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-2">
          {sectionOrder.map((section, index) => renderSection(section, index))}
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDuplicate}
              title="Duplicate visit"
              type="button"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDelete}
              title="Delete visit"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
