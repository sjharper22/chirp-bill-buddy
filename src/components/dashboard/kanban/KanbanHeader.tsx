
import { Search, Plus, UserPlus, CheckSquare, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { KanbanHeaderProps } from "./types";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { SuperbillStatus } from "@/types/superbill";
import { StatusFilterSelector } from "@/components/visit/filters/StatusFilterSelector";
import { SortOrderSelector } from "@/components/visit/filters/SortOrderSelector";
import { useIsMobile } from "@/hooks/use-mobile";

export function KanbanHeader({ 
  searchTerm, 
  onSearchChange, 
  selectionMode, 
  selectedCount,
  toggleSelectionMode,
  onAddSelectedToPatients,
  onFilterChange,
  onSortChange,
  currentFilter = "all",
  currentSort = "desc"
}: KanbanHeaderProps) {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl font-semibold">Superbills Board</h2>
        
        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search superbills..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {onFilterChange && onSortChange && (
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  className="flex items-center gap-1.5"
                >
                  <Filter className="h-4 w-4 shrink-0" />
                  <span>Filters</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <StatusFilterSelector 
                    selectedStatus={currentFilter} 
                    onStatusChange={onFilterChange} 
                  />
                  <SortOrderSelector 
                    sortOrder={currentSort} 
                    onSortOrderChange={onSortChange} 
                  />
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap ml-auto">
          {toggleSelectionMode && (
            <Button 
              onClick={toggleSelectionMode} 
              variant={selectionMode ? "secondary" : "outline"}
              size={isMobile ? "sm" : "default"}
              className="whitespace-nowrap"
            >
              <CheckSquare className="mr-1.5 h-4 w-4 shrink-0" />
              {selectionMode ? "Cancel" : "Select"}
            </Button>
          )}

          {selectionMode && selectedCount && selectedCount > 0 && onAddSelectedToPatients && (
            <Button onClick={onAddSelectedToPatients} size={isMobile ? "sm" : "default"} className="whitespace-nowrap">
              <UserPlus className="mr-1.5 h-4 w-4 shrink-0" />
              Add {selectedCount} to Patients
            </Button>
          )}
          
          {!selectionMode && (
            <Button onClick={() => navigate("/new")} size={isMobile ? "sm" : "default"}>
              <Plus className="mr-1.5 h-4 w-4 shrink-0" />
              New Superbill
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
