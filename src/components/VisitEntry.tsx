
import { useState } from "react";
import { Visit } from "@/types/superbill";
import { duplicateVisit, formatCurrency } from "@/lib/utils/superbill-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { VisitDatePicker } from "@/components/visit/VisitDatePicker";
import { VisitComplaints } from "@/components/visit/VisitComplaints";
import { IcdCodeSelector } from "@/components/visit/IcdCodeSelector";
import { CptCodeSelector } from "@/components/visit/CptCodeSelector";
import { VisitNotes } from "@/components/visit/VisitNotes";
import { useVisitSections, VisitSection } from "@/hooks/useVisitSections";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";

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

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'draft':
      default: return 'info';
    }
  };

  const statusLabel = {
    'draft': 'draft',
    'in_progress': 'in progress',
    'completed': 'completed'
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
      <div 
        className="flex justify-between items-center p-3 border-b cursor-pointer relative" 
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
          <h3 className="font-medium">
            Visit on {new Date(visit.date).toLocaleDateString()}
          </h3>
          {visit.mainComplaints && visit.mainComplaints.length > 0 && (
            <span className="text-sm text-muted-foreground">
              - {visit.mainComplaints.join(", ")}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Clickable status badge */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus();
            }}
            className="cursor-pointer"
            title="Click to change status"
          >
            <StatusBadge 
              status={statusLabel[visit.status || 'draft']} 
              variant={getStatusVariant(visit.status)}
              className="mr-2"
            />
          </div>
          
          <span className="text-sm font-medium">{formatCurrency(visit.fee)}</span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDuplicate}
            title="Duplicate visit"
            type="button"
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            title="Delete visit"
            type="button"
            className="h-8 w-8 p-0 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {!isCollapsed && (
        <CardContent className="p-4">
          <div className="space-y-3">
            {sectionOrder.map((section, index) => renderSection(section, index))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
