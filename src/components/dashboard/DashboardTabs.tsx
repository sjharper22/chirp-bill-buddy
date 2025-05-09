
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { RecentSuperbills } from "./RecentSuperbills";
import { KanbanBoard } from "./KanbanBoard";
import { QuickActions } from "./QuickActions";

interface DashboardTabsProps {
  superbills: Superbill[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  selectionMode: boolean;
  selectedPatientIds: string[];
  handleToggleSelectionMode: () => void;
  handleSelectPatient: (id: string, name: string, dob: Date, selected: boolean) => void;
  handleAddSelectedToPatients: () => void;
}

export function DashboardTabs({ 
  superbills,
  searchTerm,
  onSearchChange,
  onDelete,
  onStatusChange,
  selectionMode,
  selectedPatientIds,
  handleToggleSelectionMode,
  handleSelectPatient,
  handleAddSelectedToPatients
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("board"); // Changed default from "list" to "board"
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("detailed");
  
  // Filter superbills based on search term
  const filteredSuperbills = superbills.filter(bill => 
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Tabs 
      defaultValue="board" // Changed from "list" to "board"
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full mt-8"
    >
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="list">List View</TabsTrigger>
        <TabsTrigger value="board">Board View</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="mt-6">
        <RecentSuperbills 
          filteredSuperbills={filteredSuperbills}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          totalSuperbills={superbills.length}
          onSelectPatient={handleSelectPatient}
          selectedPatientIds={selectedPatientIds}
          selectionMode={selectionMode}
          toggleSelectionMode={handleToggleSelectionMode}
          onAddSelectedToPatients={handleAddSelectedToPatients}
        />
        
        {!selectionMode && <QuickActions />}
      </TabsContent>
      
      <TabsContent value="board" className="mt-6">
        <KanbanBoard
          superbills={filteredSuperbills}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onSelectPatient={handleSelectPatient}
          selectedPatientIds={selectedPatientIds}
          selectionMode={selectionMode}
        />
      </TabsContent>
    </Tabs>
  );
}
