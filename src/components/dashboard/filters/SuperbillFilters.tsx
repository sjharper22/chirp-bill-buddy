
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuperbillStatus } from "@/types/superbill";
import { Filter, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SuperbillFiltersProps {
  onStatusFilter: (status: SuperbillStatus | "all") => void;
  onSortChange: (order: "asc" | "desc") => void;
  currentStatus: SuperbillStatus | "all";
  currentSort: "asc" | "desc";
}

export function SuperbillFilters({ 
  onStatusFilter, 
  onSortChange, 
  currentStatus,
  currentSort
}: SuperbillFiltersProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium">Status</h4>
              <ToggleGroup 
                type="single" 
                value={currentStatus}
                onValueChange={(value) => {
                  if (value) {
                    onStatusFilter(value as SuperbillStatus | "all");
                    setOpen(false);
                  }
                }}
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="all" className="text-xs">
                  All
                </ToggleGroupItem>
                <ToggleGroupItem value="draft" className="text-xs">
                  Draft
                </ToggleGroupItem>
                <ToggleGroupItem value="in_progress" className="text-xs">
                  In Progress
                </ToggleGroupItem>
                <ToggleGroupItem value="in_review" className="text-xs">
                  In Review
                </ToggleGroupItem>
                <ToggleGroupItem value="completed" className="text-xs">
                  Completed
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div>
              <h4 className="mb-2 font-medium">Sort Order</h4>
              <div className="flex space-x-2">
                <Button
                  variant={currentSort === "desc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange("desc")}
                  className="flex-1"
                >
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  Newest First
                </Button>
                <Button
                  variant={currentSort === "asc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange("asc")}
                  className="flex-1"
                >
                  <ArrowUpAZ className="mr-2 h-4 w-4" />
                  Oldest First
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
