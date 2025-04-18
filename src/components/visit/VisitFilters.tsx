
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Search, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Visit } from "@/types/superbill";
import { formatDate } from "@/lib/utils/superbill-utils";
import { cn } from "@/lib/utils";

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

  const handleReset = () => {
    setSearchTerm("");
    setDateRange({ from: undefined, to: undefined });
    setSortOrder("desc");
    onFilteredVisitsChange([...visits].sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  const applyFilters = () => {
    let filteredVisits = [...visits];

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      filteredVisits = filteredVisits.filter(visit => {
        const visitDate = new Date(visit.date).getTime();
        const fromDate = dateRange.from ? dateRange.from.getTime() : -Infinity;
        const toDate = dateRange.to ? dateRange.to.getTime() : Infinity;
        return visitDate >= fromDate && visitDate <= toDate;
      });
    }

    // Apply search filter
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

    // Apply sorting
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
        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    formatDate(dateRange.from)
                  ) : (
                    <span>From date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => {
                    setDateRange(prev => ({ ...prev, from: date }));
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? (
                    formatDate(dateRange.to)
                  ) : (
                    <span>To date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => {
                    setDateRange(prev => ({ ...prev, to: date }));
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort Order</label>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => {
              const newOrder = sortOrder === "asc" ? "desc" : "asc";
              setSortOrder(newOrder);
              applyFilters();
            }}
          >
            {sortOrder === "asc" ? (
              <>
                Oldest First
                <ArrowUpAZ className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Newest First
                <ArrowDownAZ className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search visits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleReset}>
          Reset Filters
        </Button>
        <Button onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
