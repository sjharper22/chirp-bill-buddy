
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { toast } from "@/components/ui/use-toast";
import { Toolbar } from "./Toolbar";
import { SuperbillsGrid } from "./SuperbillsGrid";
import { ViewAllFooter } from "./ViewAllFooter";
import { RecentSuperbillsProps } from "./types";

export function RecentSuperbills({
  filteredSuperbills,
  searchTerm,
  onSearchChange,
  onDelete,
  onStatusChange,
  totalSuperbills,
  onSelectPatient,
  selectedPatientIds = [],
  selectionMode = false,
  toggleSelectionMode,
  onAddSelectedToPatients
}: RecentSuperbillsProps) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<SuperbillStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedCardIds, setExpandedCardIds] = useState<string[]>([]);
  const [isCompactView, setIsCompactView] = useState(true);
  
  // Define status priority for sorting (incomplete statuses first)
  const getStatusPriority = (status: SuperbillStatus): number => {
    switch(status) {
      case 'draft': return 1;
      case 'in_progress': return 2;
      case 'in_review': return 3;
      case 'completed': return 4;
      default: return 5;
    }
  };
  
  // Apply additional filtering based on status and sort by priority
  const displaySuperbills = filteredSuperbills
    .filter(bill => statusFilter === "all" ? true : bill.status === statusFilter)
    .sort((a, b) => {
      // First sort by status priority (incomplete first)
      const statusPriorityA = getStatusPriority(a.status);
      const statusPriorityB = getStatusPriority(b.status);
      
      if (statusPriorityA !== statusPriorityB) {
        return statusPriorityA - statusPriorityB;
      }
      
      // Then sort by date within the same status priority
      const dateA = a.issueDate ? new Date(a.issueDate).getTime() : 0;
      const dateB = b.issueDate ? new Date(b.issueDate).getTime() : 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    })
    .slice(0, 6); // Show only the most recent 6 superbills based on filters
  
  // Helper function to adapt onSelectPatient to handle different signatures
  const handleSelectPatient = onSelectPatient 
    ? (id: string) => {
        // Find the superbill to get patient name and DOB
        const superbill = filteredSuperbills.find(bill => bill.id === id);
        if (superbill) {
          // Check if already selected
          const isSelected = !(selectedPatientIds?.includes(id) || false);
          // Call onSelectPatient with all required arguments
          onSelectPatient(id, superbill.patientName, superbill.patientDob, isSelected);
        }
      }
    : undefined;
  
  // Toggle individual card expansion
  const handleToggleCardExpand = (id: string) => {
    setExpandedCardIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(cardId => cardId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  // Toggle global compact view
  const handleViewModeToggle = () => {
    // Get all visible superbill IDs
    const allVisibleIds = displaySuperbills.map(bill => bill.id);
    
    if (isCompactView) {
      // Expand all cards - important to use ALL visible IDs
      setExpandedCardIds(allVisibleIds);
      toast({
        description: "Expanded all cards",
        duration: 2000,
      });
    } else {
      // Collapse all cards
      setExpandedCardIds([]);
      toast({
        description: "Collapsed all cards",
        duration: 2000,
      });
    }
    
    setIsCompactView(!isCompactView);
  };

  return (
    <div className="mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Superbills</h2>
        
        <Toolbar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isCompactView={isCompactView}
          onViewModeToggle={handleViewModeToggle}
          selectionMode={selectionMode}
          selectedPatientIds={selectedPatientIds}
          toggleSelectionMode={toggleSelectionMode}
          onAddSelectedToPatients={onAddSelectedToPatients}
        />
      </div>
      
      <SuperbillsGrid
        displaySuperbills={displaySuperbills}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        selectionMode={selectionMode}
        handleSelectPatient={handleSelectPatient}
        selectedPatientIds={selectedPatientIds}
        expandedCardIds={expandedCardIds}
        handleToggleCardExpand={handleToggleCardExpand}
        statusFilter={statusFilter}
      />
      
      <ViewAllFooter
        displaySuperbillsCount={displaySuperbills.length}
        totalSuperbills={totalSuperbills}
        selectionMode={selectionMode}
      />
      
      {/* Removed the QuickActions component from here as it's already rendered in DashboardTabs */}
    </div>
  );
}
