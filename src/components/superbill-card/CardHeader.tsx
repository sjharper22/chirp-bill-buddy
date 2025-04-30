
import { formatDate } from "@/lib/utils/superbill-utils";
import { GripHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { CardHeaderProps } from "./types";

export function CardHeader({ patientName, issueDate, status, statusVariant }: CardHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <GripHorizontal className="h-4 w-4 mr-2 text-muted-foreground drag-handle" />
          <h3 className="font-semibold text-lg truncate max-w-[180px]">{patientName}</h3>
        </div>
        <div className="text-sm bg-primary/10 text-primary font-medium px-2 py-0.5 rounded">
          {formatDate(issueDate)}
        </div>
      </div>
      
      <div className="mb-2">
        <StatusBadge 
          status={status} 
          variant={statusVariant}
        />
      </div>
    </>
  );
}
