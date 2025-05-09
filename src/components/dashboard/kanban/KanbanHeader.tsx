
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Check, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SuperbillStatus } from "@/types/superbill";
import { SuperbillFilters } from "@/components/dashboard/filters/SuperbillFilters";
import { KanbanHeaderProps } from "./types";
import { CardViewToggle } from "./CardViewToggle";

export function KanbanHeader({
  searchTerm,
  onSearchChange,
  selectionMode,
  selectedCount,
  onFilterChange,
  onSortChange,
  currentFilter,
  currentSort,
  viewMode,
  onViewModeChange
}: KanbanHeaderProps) {
  const navigate = useNavigate();
  const [expandSearch, setExpandSearch] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Superbills Board</h2>
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className="bg-primary text-primary-foreground text-sm rounded-full px-2">
            {selectedCount} selected
          </span>
        )}
      </div>
      
      <div className="flex items-center flex-wrap gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
        {/* Card View Toggle */}
        {viewMode && onViewModeChange && (
          <CardViewToggle
            viewMode={viewMode}
            onChange={onViewModeChange}
          />
        )}
        
        <div className={`relative transition-all ${expandSearch ? 'w-full sm:w-64' : 'w-10'}`}>
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer z-10" 
            onClick={() => setExpandSearch(true)}
          />
          <Input
            placeholder="Search superbills..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setExpandSearch(true)}
            onBlur={() => searchTerm === '' && setExpandSearch(false)}
            className={`transition-all pl-10 ${expandSearch ? 'opacity-100 w-full' : 'opacity-0 w-0 p-0 -ml-10 sm:ml-0'}`}
          />
        </div>
        
        <SuperbillFilters 
          onStatusFilter={onFilterChange}
          onSortChange={onSortChange}
          currentStatus={currentFilter}
          currentSort={currentSort}
        />
        
        {!selectionMode && (
          <Button onClick={() => navigate("/new")} className="whitespace-nowrap ml-auto sm:ml-0">
            New Superbill
          </Button>
        )}
      </div>
    </div>
  );
}
