
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
  handleDragStart,
  sidebarState
}: KanbanColumnProps) {
  // Filter superbills that match this column's status
  const columnSuperbills = superbills.filter(bill => bill.status === column.id);
  const isCollapsed = sidebarState === "collapsed";

  return (
    <div
      className={`flex flex-col rounded-md border shadow-sm bg-card h-[500px] min-w-[220px] snap-start ${isCollapsed ? "md:min-w-[250px]" : ""} flex-shrink-0 flex-grow`}
      onDragOver={(e) => onDragOver(e)}
      onDragLeave={(e) => onDragLeave(e)} 
      onDrop={(e) => onDrop(e, column.id as SuperbillStatus)}
    >
      <div className="flex flex-col p-3 bg-muted/50 rounded-t-md shrink-0 gap-y-2">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-start gap-2">
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
            onDragStart={handleDragStart}
            availableStatuses={allColumns}
            currentStatus={column.id as SuperbillStatus}
            isCollapsed={isCollapsed}
          />
        ))}
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
