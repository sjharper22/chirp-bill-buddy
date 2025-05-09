
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, CheckSquare, UserPlus } from "lucide-react";
import { useState } from "react";
import { KanbanHeaderProps } from "./types";
import { SuperbillStatus } from "@/types/superbill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewModeToggle } from "@/components/superbill-card/ViewModeToggle";

export function KanbanHeader({
  searchTerm,
  onSearchChange,
  selectionMode,
  selectedCount = 0,
  toggleSelectionMode,
  onAddSelectedToPatients,
  onFilterChange,
  onSortChange,
  currentFilter = "all",
  currentSort = "desc",
  isCompactView,
  onViewModeToggle
}: KanbanHeaderProps) {
  const [expandSearch, setExpandSearch] = useState(false);
  
  // Filter options
  const filterOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "in_progress", label: "In Progress" },
    { value: "in_review", label: "In Review" },
    { value: "completed", label: "Completed" }
  ];
  
  // Sort options
  const sortOptions = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" }
  ];
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold">Superbills Board</h2>
        {selectedCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
            {selectedCount} selected
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <div className={`relative transition-all ${expandSearch ? 'w-full sm:w-64' : 'w-10'}`}>
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer z-10" 
            onClick={() => setExpandSearch(true)}
          />
          <Input
            placeholder="Search superbills..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setExpandSearch(true)}
            onBlur={() => searchTerm === '' && setExpandSearch(false)}
            className={`transition-all pl-10 ${expandSearch ? 'opacity-100 w-full' : 'opacity-0 w-0 p-0 -ml-10'}`}
          />
        </div>
        
        {onFilterChange && (
          <Select
            value={currentFilter}
            onValueChange={(value) => onFilterChange(value as SuperbillStatus | "all")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {onSortChange && (
          <Select
            value={currentSort}
            onValueChange={(value) => onSortChange(value as "asc" | "desc")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {onViewModeToggle && isCompactView !== undefined && (
          <ViewModeToggle 
            isCompactView={isCompactView}
            onToggle={onViewModeToggle}
          />
        )}
        
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

        {selectionMode && selectedCount > 0 && onAddSelectedToPatients && (
          <Button onClick={onAddSelectedToPatients} className="whitespace-nowrap">
            <UserPlus className="mr-2 h-4 w-4" />
            Add {selectedCount} to Patients
          </Button>
        )}
        
        {!selectionMode && (
          <Button asChild>
            <a href="/new">
              <Plus className="mr-2 h-4 w-4" />
              New Superbill
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
