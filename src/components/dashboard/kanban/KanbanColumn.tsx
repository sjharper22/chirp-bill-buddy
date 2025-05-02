
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { SuperbillStatus } from "@/types/superbill";
import { getStatusVariant } from "@/lib/utils/visit-utils";
import { KanbanColumnProps } from "./types";

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
      className="w-full h-full flex flex-col rounded-md border shadow-sm bg-card"
      onDragOver={(e) => onDragOver(e)}
      onDragLeave={(e) => onDragLeave(e)} 
      onDrop={(e) => onDrop(e, column.id as SuperbillStatus)}
    >
      <div className="flex items-center justify-between mb-2 p-2 bg-muted/50 rounded-t-md">
        <div className="flex items-center gap-2">
          {column.icon && <column.icon className="h-4 w-4" />}
          <h3 className="font-medium">{column.title}</h3>
          <StatusBadge 
            status={column.id} 
            variant={getStatusVariant(column.id)} 
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {columnSuperbills.length} {columnSuperbills.length === 1 ? 'superbill' : 'superbills'}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        {columnSuperbills.map(superbill => (
          <div
            key={superbill.id}
            draggable
            onDragStart={(e) => handleDragStart(e, superbill.id)}
            className="p-3 mb-2 rounded-md border shadow-sm bg-white cursor-move"
          >
            <h4 className="font-semibold text-sm">{superbill.patientName}</h4>
            <p className="text-xs text-muted-foreground">{superbill.id}</p>
          </div>
        ))}
      </div>

      {columnSuperbills.length === 0 && (
        <div className="p-4 text-center">
          <div className="bg-muted/30 p-8 rounded-md">
            {column.icon && <column.icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />}
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
