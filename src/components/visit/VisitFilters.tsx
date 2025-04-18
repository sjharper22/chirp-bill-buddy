
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
    <div className="mb-6 space-y-4 border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Filter Visits</h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DateRangeSelector 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        
        <SortOrderSelector
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
        
        <SearchVisits
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={handleReset}
          type="button"
        >
          Reset Filters
        </Button>
        <Button 
          onClick={applyFilters}
          type="button"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
