
import { Visit } from "@/types/superbill";
import { DateRangeSelector } from "./filters/DateRangeSelector";
import { SortOrderSelector } from "./filters/SortOrderSelector";
import { SearchVisits } from "./filters/SearchVisits";
import { useVisitFilters } from "@/hooks/useVisitFilters";
import { Button } from "@/components/ui/button";

interface VisitFiltersProps {
  visits: Visit[];
  onFilteredVisitsChange: (visits: Visit[]) => void;
}

export function VisitFilters({ visits, onFilteredVisitsChange }: VisitFiltersProps) {
  const {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    sortOrder,
    setSortOrder,
    handleReset,
    applyFilters,
  } = useVisitFilters({ visits, onFilteredVisitsChange });

  return (
    <div className="mb-6 space-y-4 border border-border rounded-lg p-4 bg-card">
      <h3 className="font-semibold text-card-foreground">Filter Visits</h3>
      
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <div className="w-full">
          <DateRangeSelector 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
        
        <div className="w-full">
          <SortOrderSelector
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </div>
        
        <div className="w-full md:col-span-2 xl:col-span-2">
          <SearchVisits
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={handleReset}
          type="button"
          className="w-full sm:w-auto"
        >
          Reset Filters
        </Button>
        <Button 
          onClick={applyFilters}
          type="button"
          className="w-full sm:w-auto"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
