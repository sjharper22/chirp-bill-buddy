
import { formatDate } from "@/lib/utils/superbill-utils";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { CardHeaderProps } from "./types";
import { ChevronDown, ChevronUp, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusSelector } from "./StatusSelector";
import { getStatusVariant, statusToDisplay } from "@/lib/utils/visit-utils";

export function CardHeader({ 
  patientName, 
  issueDate, 
  status, 
  statusVariant, 
  onStatusChange,
  isExpanded,
  onToggleExpand
}: CardHeaderProps) {
  // Format the date properly if it's a string or Date object
  const formattedDate = typeof issueDate === 'string' ? 
    formatDate(new Date(issueDate)) : 
    formatDate(issueDate);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand();
  };
  
  return (
    <div className="flex justify-between items-start">
      <div className="flex-grow">
        <div className="flex items-center">
          <GripHorizontal className="h-4 w-4 mr-2 text-muted-foreground drag-handle" />
          <h3 className="font-semibold text-lg truncate max-w-[180px]">{patientName}</h3>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-0 ml-2"
            onClick={handleToggleExpand}
          >
            {isExpanded ? 
              <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </Button>
        </div>
        
        <div className="text-sm text-primary/90 font-medium mt-0.5">
          {formattedDate}
        </div>
      </div>
      
      <div>
        {onStatusChange ? (
          <StatusSelector 
            currentStatus={status.toLowerCase() as any}
            onStatusChange={onStatusChange}
          />
        ) : (
          <StatusBadge 
            status={status} 
            variant={statusVariant as "default" | "info" | "success" | "warning" | "error"}
          />
        )}
      </div>
    </div>
  );
}
