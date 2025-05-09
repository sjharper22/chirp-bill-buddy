
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, CheckSquare } from "lucide-react";
import { SuperbillFilters } from "../filters/SuperbillFilters";
import { ViewModeToggle } from "@/components/superbill-card/ViewModeToggle";
import { SearchBar } from "./SearchBar";
import { ToolbarProps } from "./types";
import { useState } from "react";

export function Toolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  isCompactView,
  onViewModeToggle,
  selectionMode = false,
  selectedPatientIds = [],
  toggleSelectionMode,
  onAddSelectedToPatients
}: ToolbarProps) {
  const [expandSearch, setExpandSearch] = useState(false);

  return (
    <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto flex-wrap">
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange}
        expandSearch={expandSearch}
        setExpandSearch={setExpandSearch}
      />
      
      <SuperbillFilters 
        onStatusFilter={setStatusFilter}
        onSortChange={setSortOrder}
        currentStatus={statusFilter}
        currentSort={sortOrder}
      />
      
      <ViewModeToggle
        isCompactView={isCompactView}
        onToggle={onViewModeToggle}
      />
      
      {toggleSelectionMode && (
        <Button 
          onClick={toggleSelectionMode} 
          variant={selectionMode ? "secondary" : "outline"}
          className="whitespace-nowrap"
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          {selectionMode ? "Cancel Selection" : "Select Patients"}
        </Button>
      )}

      {selectionMode && selectedPatientIds && selectedPatientIds.length > 0 && onAddSelectedToPatients && (
        <Button onClick={onAddSelectedToPatients} className="whitespace-nowrap">
          <UserPlus className="mr-2 h-4 w-4" />
          Add {selectedPatientIds.length} to Patients
        </Button>
      )}
      
      {!selectionMode && (
        <Button onClick={() => window.location.href = "/new"} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          New Superbill
        </Button>
      )}
    </div>
  );
}
