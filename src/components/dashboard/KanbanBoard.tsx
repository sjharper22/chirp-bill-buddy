
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

  // Filter superbills based on search term
  const filteredSuperbills = superbills.filter(bill => 
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Move a superbill to another status
  const moveSuperbill = (id: string, newStatus: SuperbillStatus) => {
    onStatusChange(id, newStatus);
    toast({
      title: "Status updated",
      description: `Superbill moved to ${newStatus.replace('_', ' ')}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Superbills Board</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search superbills..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-10 w-[250px]"
            />
          </div>
          <Button onClick={() => navigate("/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Superbill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {columns.map(column => {
          // Get superbills for this column
          const columnSuperbills = filteredSuperbills.filter(bill => bill.status === column.id);
          
          return (
            <div key={column.id} className="flex flex-col bg-white rounded-lg border shadow-sm h-full min-h-[24rem]">
              <div className="p-4 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <StatusBadge status={column.title} variant={column.variant} />
                  <span className="text-sm font-medium ml-2">{columnSuperbills.length}</span>
                </div>
              </div>
              
              <div className="p-3 flex flex-col gap-3 flex-grow overflow-y-auto max-h-[calc(100vh-240px)]">
                {columnSuperbills.length > 0 ? (
                  columnSuperbills.map(superbill => (
                    <div key={superbill.id} className="pb-0">
                      <SuperbillCard
                        superbill={superbill}
                        onDelete={onDelete}
                        onClick={() => navigate(`/view/${superbill.id}`)}
                      />
                      
                      <div className="flex justify-between mt-2 px-2">
                        {columns.map(targetColumn => 
                          targetColumn.id !== column.id && (
                            <Button 
                              key={targetColumn.id}
                              variant="ghost" 
                              size="sm"
                              onClick={() => moveSuperbill(superbill.id, targetColumn.id)}
                              className="text-xs"
                            >
                              <targetColumn.icon className="h-3 w-3 mr-1" />
                              Move to {targetColumn.title}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500 flex flex-col items-center justify-center h-full">
                    <column.icon className="h-10 w-10 text-gray-400 mb-2" />
                    <p>No superbills in {column.title}</p>
                    <p className="text-xs text-gray-400">{column.description}</p>
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
