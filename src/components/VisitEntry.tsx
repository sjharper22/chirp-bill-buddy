
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const handleStatusChange = (status: string) => {
    onVisitChange({ 
      ...visit, 
      status: status as 'draft' | 'in_progress' | 'completed'
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
        
        {/* Status Badge in upper right corner */}
        <div className="absolute top-3 right-24">
          <StatusBadge 
            status={visit.status || 'draft'} 
            variant={getStatusVariant(visit.status)}
          />
        </div>
        
        <div className="flex items-center gap-2">
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={visit.status || 'draft'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            {sectionOrder.map((section, index) => renderSection(section, index))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
