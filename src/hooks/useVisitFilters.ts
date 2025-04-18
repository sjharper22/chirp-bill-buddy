
import { useState, useEffect } from "react";
import { Visit } from "@/types/superbill";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface UseVisitFiltersProps {
  visits: Visit[];
  onFilteredVisitsChange: (visits: Visit[]) => void;
}

export function useVisitFilters({ visits, onFilteredVisitsChange }: UseVisitFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Apply initial sorting and whenever visits array changes
  useEffect(() => {
    const sortedVisits = [...visits].sort((a, b) => {
      // Ensure we're comparing date objects
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const comparison = dateA.getTime() - dateB.getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });
    onFilteredVisitsChange(sortedVisits);
  }, [visits, sortOrder, onFilteredVisitsChange]);

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchTerm("");
    setDateRange({ from: undefined, to: undefined });
    setSortOrder("desc");
    
    // Apply the same sorting logic when resetting filters
    const sortedVisits = [...visits].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    onFilteredVisitsChange(sortedVisits);
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

    // Ensure proper date sorting by explicitly creating Date objects
    filteredVisits.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const comparison = dateA.getTime() - dateB.getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });

    onFilteredVisitsChange(filteredVisits);
  };

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    sortOrder,
    setSortOrder,
    handleReset,
    applyFilters,
  };
}
