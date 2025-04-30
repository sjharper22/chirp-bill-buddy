
import { useState } from "react";
import { SuperbillCard } from "@/components/SuperbillCard";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Plus, Search, ClipboardCheck, ClipboardList, FileText, FileEdit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface KanbanColumn {
  id: SuperbillStatus;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error';
}

const columns: KanbanColumn[] = [
  {
    id: "draft",
    title: "Draft",
    icon: FileText,
    description: "Not yet started",
    variant: "info"
  },
  {
    id: "in_progress",
    title: "In Progress",
    icon: FileEdit,
    description: "Being worked on",
    variant: "warning"
  },
  {
    id: "in_review",
    title: "In Review",
    icon: ClipboardList,
    description: "Ready for review",
    variant: "info"
  },
  {
    id: "completed",
    title: "Completed",
    icon: ClipboardCheck,
    description: "Ready for submission",
    variant: "success"
  }
];

interface KanbanBoardProps {
  superbills: Superbill[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SuperbillStatus) => void;
}

export function KanbanBoard({
  superbills,
  searchTerm,
  onSearchChange,
  onDelete,
  onStatusChange
}: KanbanBoardProps) {
  const navigate = useNavigate();
  const [draggedBillId, setDraggedBillId] = useState<string | null>(null);

  // Filter superbills based on search term
  const filteredSuperbills = superbills.filter(bill => 
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Start dragging a superbill
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedBillId(id);
    // Set ghost drag image
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  // Handle drag over column to allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget) {
      e.currentTarget.classList.add('bg-muted/50');
    }
  };

  // Handle drag leave to remove highlighting
  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget) {
      e.currentTarget.classList.remove('bg-muted/50');
    }
  };

  // Handle drop of superbill in a column
  const handleDrop = (e: React.DragEvent, newStatus: SuperbillStatus) => {
    e.preventDefault();
    
    // Remove highlighting
    if (e.currentTarget) {
      e.currentTarget.classList.remove('bg-muted/50');
    }
    
    // If we have a dragged bill and it's not already in this status
    if (draggedBillId) {
      const bill = superbills.find(b => b.id === draggedBillId);
      if (bill && bill.status !== newStatus) {
        onStatusChange(draggedBillId, newStatus);
        toast({
          title: "Status updated",
          description: `Superbill for ${bill.patientName} moved to ${newStatus.replace('_', ' ')}.`,
        });
      }
      setDraggedBillId(null);
    }
  };

  // Move a superbill to another status (button click)
  const moveSuperbill = (id: string, newStatus: SuperbillStatus) => {
    onStatusChange(id, newStatus);
    toast({
      title: "Status updated",
      description: `Superbill moved to ${newStatus.replace('_', ' ')}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Superbills Board</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search superbills..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-[250px]"
            />
          </div>
          <Button onClick={() => navigate("/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Superbill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {columns.map(column => {
          // Get superbills for this column
          const columnSuperbills = filteredSuperbills.filter(bill => bill.status === column.id);
          
          return (
            <div 
              key={column.id} 
              className="flex flex-col bg-white rounded-lg border shadow-sm h-full min-h-[30rem]"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-4 flex justify-between items-center border-b bg-muted/30">
                <div className="flex items-center">
                  <column.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                  <h3 className="font-medium">{column.title}</h3>
                  <div className="ml-2 flex items-center">
                    <StatusBadge status={column.title} variant={column.variant} className="mr-1" />
                    <span className="text-sm font-medium">{columnSuperbills.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex flex-col gap-4 flex-grow overflow-y-auto max-h-[calc(100vh-240px)]">
                {columnSuperbills.length > 0 ? (
                  columnSuperbills.map(superbill => (
                    <div 
                      key={superbill.id} 
                      className="relative"
                      draggable
                      onDragStart={(e) => handleDragStart(e, superbill.id)}
                    >
                      <div className="cursor-grab active:cursor-grabbing">
                        <SuperbillCard
                          superbill={superbill}
                          onDelete={onDelete}
                          onClick={() => navigate(`/view/${superbill.id}`)}
                        />
                      </div>
                      
                      {/* Move actions - positioned below the card with spacing */}
                      <div className="mt-2 flex flex-wrap gap-1 justify-end">
                        {columns
                          .filter(targetColumn => targetColumn.id !== column.id)
                          .map(targetColumn => (
                            <Button 
                              key={targetColumn.id}
                              variant="ghost" 
                              size="sm"
                              onClick={() => moveSuperbill(superbill.id, targetColumn.id)}
                              className="text-xs py-0 h-7 hover:bg-muted"
                            >
                              <targetColumn.icon className="h-3 w-3 mr-1" />
                              Move to {targetColumn.title}
                            </Button>
                          ))
                        }
                      </div>
                    </div>
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
        })}
      </div>
    </div>
  );
}
