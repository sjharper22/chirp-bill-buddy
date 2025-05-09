
import { CardViewToggleProps } from "../../../components/superbill-card/types";
import { LayoutGrid, Menu } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export function CardViewToggle({ viewMode, onChange }: CardViewToggleProps) {
  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      <Toggle
        aria-label="Toggle compact view"
        pressed={viewMode === "compact"}
        onPressedChange={() => onChange("compact")}
        className={`rounded-none rounded-l-md px-3 ${viewMode === "compact" ? "bg-muted" : ""}`}
      >
        <Menu className="h-4 w-4 mr-1" />
        <span className="sr-only sm:not-sr-only sm:text-xs">Compact</span>
      </Toggle>
      <Toggle
        aria-label="Toggle detailed view"
        pressed={viewMode === "detailed"}
        onPressedChange={() => onChange("detailed")}
        className={`rounded-none rounded-r-md px-3 ${viewMode === "detailed" ? "bg-muted" : ""}`}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        <span className="sr-only sm:not-sr-only sm:text-xs">Detailed</span>
      </Toggle>
    </div>
  );
}
