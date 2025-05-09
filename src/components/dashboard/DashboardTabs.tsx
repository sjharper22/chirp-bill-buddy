
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { RecentSuperbills } from "./recent-superbills/RecentSuperbills";
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
  const [activeTab, setActiveTab] = useState("board"); 
  
  // Filter superbills based on search term
  const filteredSuperbills = superbills.filter(bill => 
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to adapt handleSelectPatient for the KanbanBoard component
  const handleKanbanSelectPatient = (id: string) => {
    // Find the superbill to get patient name and DOB
    const superbill = superbills.find(bill => bill.id === id);
    if (superbill) {
      // Check if already selected
      const isSelected = !(selectedPatientIds?.includes(id) || false);
      // Call handleSelectPatient with all required arguments
      handleSelectPatient(id, superbill.patientName, superbill.patientDob, isSelected);
    }
  };
  
  return (
    <Tabs 
      defaultValue="board" 
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
          onSelectPatient={selectionMode ? handleKanbanSelectPatient : undefined}
          selectedPatientIds={selectedPatientIds}
          selectionMode={selectionMode}
        />
      </TabsContent>
    </Tabs>
  );
}
