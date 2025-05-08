import { SuperbillStatus } from "@/types/superbill";
import { formatDate, formatStatus } from "@/lib/utils/superbill-utils";
import { CardHeaderProps } from "./types";

export function CardHeader({ 
  patientName, 
  issueDate, 
  status, 
  statusVariant,
  onStatusChange,
  compact
}: CardHeaderProps) {
  const displayStatus = formatStatus(status);
  const formattedDate = formatDate(issueDate);
  
  return (
    <div className="flex justify-between items-start mb-2 gap-1">
      <div className="flex items-start gap-1.5">
        <h3 className={`font-semibold ${compact ? "text-sm" : "text-lg"} truncate max-w-[150px]`}>
          {patientName}
        </h3>
      </div>
      
      <div className={`text-sm ${compact ? "text-xs" : ""} bg-primary/10 text-primary font-medium px-2 py-0.5 rounded whitespace-nowrap`}>
        {formattedDate}
      </div>
    </div>
  );
}
