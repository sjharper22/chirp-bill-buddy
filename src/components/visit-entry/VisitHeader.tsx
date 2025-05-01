
import { Visit } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/superbill-utils";
import { Copy, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";

interface VisitHeaderProps {
  visit: Visit;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  toggleStatus: () => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function VisitHeader({
  visit,
  isCollapsed,
  toggleCollapse,
  toggleStatus,
  onDuplicate,
  onDelete
}: VisitHeaderProps) {
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

  return (
    <div 
      className="flex justify-between items-center p-3 border-b cursor-pointer relative" 
      onClick={toggleCollapse}
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
          onClick={onDuplicate}
          title="Duplicate visit"
          type="button"
          className="h-8 w-8 p-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDelete}
          title="Delete visit"
          type="button"
          className="h-8 w-8 p-0 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
