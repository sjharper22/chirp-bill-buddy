
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

  // Helper function to ensure consistent date comparison
  const sortVisitsByDate = (visitsToSort: Visit[], order: "asc" | "desc" = sortOrder) => {
    return [...visitsToSort].sort((a, b) => {
      // Force date conversion to ensure consistent comparison
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Apply initial sorting and whenever visits array changes
  useEffect(() => {
    const sortedVisits = sortVisitsByDate(visits);
    onFilteredVisitsChange(sortedVisits);
  }, [visits, sortOrder, onFilteredVisitsChange]);

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchTerm("");
    setDateRange({ from: undefined, to: undefined });
    setSortOrder("desc");
    
    // Use the helper function to ensure consistent sorting
    const sortedVisits = sortVisitsByDate(visits, "desc");
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

    // Use the helper function to ensure consistent sorting
    const sortedAndFilteredVisits = sortVisitsByDate(filteredVisits);
    onFilteredVisitsChange(sortedAndFilteredVisits);
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
