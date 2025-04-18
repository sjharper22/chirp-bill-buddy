
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Visit } from "@/types/superbill";
import { DateRangeSelector } from "./filters/DateRangeSelector";
import { SortOrderSelector } from "./filters/SortOrderSelector";
import { SearchVisits } from "./filters/SearchVisits";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface VisitFiltersProps {
  visits: Visit[];
  onFilteredVisitsChange: (visits: Visit[]) => void;
}

export function VisitFilters({ visits, onFilteredVisitsChange }: VisitFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Apply initial sorting and whenever visits array changes
  useEffect(() => {
    const sortedVisits = [...visits].sort((a, b) => {
      const comparison = a.date.getTime() - b.date.getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });
    onFilteredVisitsChange(sortedVisits);
  }, [visits, sortOrder, onFilteredVisitsChange]);

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchTerm("");
    setDateRange({ from: undefined, to: undefined });
    setSortOrder("desc");
    onFilteredVisitsChange([...visits].sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  const applyFilters = (e: React.MouseEvent) => {
    e.preventDefault();
    
    let filteredVisits = [...visits];

    if (dateRange.from || dateRange.to) {
      filteredVisits = filteredVisits.filter(visit => {
        const visitDate = new Date(visit.date).getTime();
        const fromDate = dateRange.from ? dateRange.from.getTime() : -Infinity;
        const toDate = dateRange.to ? dateRange.to.getTime() : Infinity;
        return visitDate >= fromDate && visitDate <= toDate;
      });
    }

    if (searchTerm) {
      filteredVisits = filteredVisits.filter(visit => {
        const searchLower = searchTerm.toLowerCase();
        return (
          visit.notes?.toLowerCase().includes(searchLower) ||
          visit.mainComplaints.some(complaint => 
            complaint.toLowerCase().includes(searchLower)
          ) ||
          visit.icdCodes.some(code => 
            code.toLowerCase().includes(searchLower)
          ) ||
          visit.cptCodes.some(code => 
            code.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    filteredVisits.sort((a, b) => {
      const comparison = a.date.getTime() - b.date.getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });

    onFilteredVisitsChange(filteredVisits);
  };

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
