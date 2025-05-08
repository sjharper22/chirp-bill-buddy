
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { SuperbillStatus } from "@/types/superbill";
import { getStatusVariant } from "@/lib/utils/visit-utils";
import { KanbanColumnProps } from "./types";
import { formatCurrency, formatDate } from "@/lib/utils/superbill-utils";
import { KanbanCard } from "./KanbanCard";

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
      className="flex flex-col rounded-md border shadow-sm bg-card min-h-[400px] h-full max-h-[600px] min-w-0"
      onDragOver={(e) => onDragOver(e)}
      onDragLeave={(e) => onDragLeave(e)} 
      onDrop={(e) => onDrop(e, column.id as SuperbillStatus)}
    >
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-t-md shrink-0">
        <div className="flex items-center gap-1.5">
          {column.icon && <column.icon className="h-4 w-4 shrink-0" />}
          <h3 className="font-medium truncate">{column.title}</h3>
          <StatusBadge 
            status={column.id} 
            variant={getStatusVariant(column.id)} 
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap ml-1">
          {columnSuperbills.length} {columnSuperbills.length === 1 ? 'bill' : 'bills'}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        {columnSuperbills.map(superbill => (
          <KanbanCard
            key={superbill.id}
            superbill={superbill}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onSelectPatient={onSelectPatient}
            isPatientSelected={selectedPatientIds?.includes(superbill.id)}
            onDragStart={(e) => handleDragStart(e, superbill.id)}
            availableStatuses={allColumns}
            currentStatus={column.id as SuperbillStatus}
          />
        ))}

        {columnSuperbills.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-4 h-full">
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
    </div>
  );
}
