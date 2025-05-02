import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { SuperbillStatus } from "@/types/superbill";
import { KanbanColumnProps } from "./types";

export function KanbanColumn({
  superbills,
  column,
  onStatusChange,
  onDelete,
  searchTerm,
  onSelectPatient,
  selectedPatientIds,
  selectionMode
}: KanbanColumnProps) {
  const filteredSuperbills = superbills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && bill.status === column.status;
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("superbillId");
    onStatusChange(id, column.status);
  };
  
  return (
    <div
      className="w-full h-full flex flex-col rounded-md border shadow-sm bg-card"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-2 p-2 bg-muted/50 rounded-t-md">
        <div className="flex items-center gap-2">
          {column.icon && <column.icon className="h-4 w-4" />}
          <h3 className="font-medium">{column.title}</h3>
          <StatusBadge 
            status={column.status} 
            variant={getStatusVariant(column.status)} 
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredSuperbills.length} {filteredSuperbills.length === 1 ? 'superbill' : 'superbills'}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        {filteredSuperbills.map(superbill => (
          <div
            key={superbill.id}
            draggable
            onDragStart={e => e.dataTransfer.setData("superbillId", superbill.id)}
            className="p-3 mb-2 rounded-md border shadow-sm bg-white cursor-move"
          >
            <h4 className="font-semibold text-sm">{superbill.patientName}</h4>
            <p className="text-xs text-muted-foreground">{superbill.id}</p>
          </div>
        ))}
      </div>

      {filteredSuperbills.length === 0 && (
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

// Helper function to get the status variant
function getStatusVariant(status: SuperbillStatus | string): "default" | "success" | "warning" | "info" | "error" {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
    case "in_review":
      return "warning";
    case "draft":
      return "info";
    default:
      return "default";
  }
}
