
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
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Superbills Board</h2>
        
        <div className="relative flex-grow sm:flex-grow-0 sm:w-[200px] md:w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search superbills..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {onFilterChange && onSortChange && (
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 h-8"
              >
                <Filter className="h-4 w-4 shrink-0" />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4" align="end">
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
        
        {toggleSelectionMode && (
          <Button 
            onClick={toggleSelectionMode} 
            variant={selectionMode ? "secondary" : "outline"}
            size="sm"
            className="whitespace-nowrap h-8"
          >
            <CheckSquare className="mr-2 h-4 w-4 shrink-0" />
            {selectionMode ? "Cancel" : "Select"}
          </Button>
        )}

        {selectionMode && selectedCount && selectedCount > 0 && onAddSelectedToPatients && (
          <Button onClick={onAddSelectedToPatients} size="sm" className="whitespace-nowrap h-8">
            <UserPlus className="mr-2 h-4 w-4 shrink-0" />
            Add {selectedCount}
          </Button>
        )}
        
        {!selectionMode && (
          <Button onClick={() => navigate("/new")} size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4 shrink-0" />
            New Superbill
          </Button>
        )}
      </div>
    </div>
  );
}
