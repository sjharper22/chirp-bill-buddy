
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { KanbanCard } from "./KanbanCard";
import { KanbanColumnProps } from "./types";

export function KanbanColumn({ 
  column, 
  superbills,
  onDelete, 
  onStatusChange, 
  allColumns = [], 
  onDragOver,
  onDragLeave,
  onDrop,
  handleDragStart,
  onSelectPatient,
  selectedPatientIds = []
}: KanbanColumnProps) {
  return (
    <div 
      className="flex flex-col bg-white rounded-lg border shadow-sm h-full min-h-[30rem]"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop && onDrop(e, column.id)}
    >
      <div className="p-4 flex justify-between items-center border-b bg-muted/30">
        <div className="flex items-center">
          <column.icon className="h-5 w-5 mr-2 text-muted-foreground" />
          <h3 className="font-medium">{column.title}</h3>
          <div className="ml-2 flex items-center">
            <StatusBadge status={column.title} variant={column.variant as "default" | "success" | "warning" | "info" | "error"} className="mr-1" />
            <span className="text-sm font-medium">{superbills.length}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col gap-4 flex-grow overflow-y-auto max-h-[calc(100vh-240px)]">
        {superbills.length > 0 ? (
          superbills.map(superbill => (
            <KanbanCard
              key={superbill.id}
              superbill={superbill}
              onDelete={onDelete}
              onDragStart={handleDragStart}
              onStatusChange={onStatusChange}
              availableStatuses={allColumns}
              currentStatus={column.id}
              onSelectPatient={onSelectPatient}
              isPatientSelected={selectedPatientIds.includes(superbill.id)}
            />
          ))
        ) : (
          <div className="text-center p-8 text-gray-500 flex flex-col items-center justify-center h-full">
            <column.icon className="h-12 w-12 text-gray-300 mb-3" />
            <p>No superbills in {column.title}</p>
            <p className="text-xs text-gray-400 mt-1">{column.description}</p>
            <p className="text-sm text-primary mt-6">Drag superbills here</p>
          </div>
        )}
      </div>
    </div>
  );
}
