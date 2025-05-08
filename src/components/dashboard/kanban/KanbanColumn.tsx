
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { SuperbillStatus } from "@/types/superbill";
import { getStatusVariant } from "@/lib/utils/visit-utils";
import { KanbanColumnProps } from "./types";
import { formatCurrency, formatDate } from "@/lib/utils/superbill-utils";

export function KanbanColumn({
  superbills,
  column,
  onStatusChange,
  onDelete,
  onSelectPatient,
  selectedPatientIds,
  allColumns,
  onDragOver,
  onDragLeave,
  onDrop,
  handleDragStart
}: KanbanColumnProps) {
  // Filter superbills that match this column's status
  const columnSuperbills = superbills.filter(bill => bill.status === column.id);

  return (
    <div
      className="flex flex-col rounded-md border shadow-sm bg-card h-[500px] min-w-[250px] snap-start"
      onDragOver={(e) => onDragOver(e)}
      onDragLeave={(e) => onDragLeave(e)} 
      onDrop={(e) => onDrop(e, column.id as SuperbillStatus)}
    >
      <div className="flex flex-col p-3 bg-muted/50 rounded-t-md shrink-0 gap-y-2">
        <div className="flex items-start gap-2 flex-wrap">
          {column.icon && <column.icon className="h-4 w-4 shrink-0 mt-0.5" />}
          <h3 className="font-medium">{column.title}</h3>
        </div>
        
        <div className="flex flex-wrap items-start gap-2">
          <StatusBadge 
            status={column.id} 
            variant={getStatusVariant(column.id)} 
            className="w-fit"
          />
          
          <span className="text-sm text-muted-foreground">
            {columnSuperbills.length} {columnSuperbills.length === 1 ? 'superbill' : 'superbills'}
          </span>
        </div>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        {columnSuperbills.map(superbill => {
          // Calculate total fee from all visits
          const totalFee = superbill.visits.reduce((sum, visit) => sum + (visit.fee || 0), 0);
          // Get visit count
          const visitCount = superbill.visits.length;
          
          return (
            <div
              key={superbill.id}
              draggable
              onDragStart={(e) => handleDragStart(e, superbill.id)}
              className="p-3 mb-2 rounded-md border shadow-sm bg-white cursor-move hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-sm">{superbill.patientName}</h4>
              <div className="text-xs mt-1 text-muted-foreground">
                <p>DOB: {formatDate(superbill.patientDob)}</p>
                <div className="flex justify-between mt-1">
                  <span>Visits: {visitCount}</span>
                  <span className="font-medium text-foreground">{formatCurrency(totalFee)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {columnSuperbills.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-muted/30 p-4 rounded-md w-full text-center">
            {column.icon && <column.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />}
            <p className="text-sm font-medium text-muted-foreground">No superbills</p>
            <p className="text-xs text-muted-foreground mt-1">
              {column.description || "Drag superbills here"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
