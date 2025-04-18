
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

interface SortOrderSelectorProps {
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
}

export function SortOrderSelector({ sortOrder, onSortOrderChange }: SortOrderSelectorProps) {
  const handleSortToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sort Order</label>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={handleSortToggle}
        type="button"
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
  );
}
