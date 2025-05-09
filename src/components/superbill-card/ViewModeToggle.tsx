
import { Button } from "@/components/ui/button";
import { Expand, Minimize } from "lucide-react";
import { ViewModeToggleProps } from "./types";

export function ViewModeToggle({ isCompactView, onToggle }: ViewModeToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onToggle()}
      className="whitespace-nowrap"
    >
      {isCompactView ? (
        <>
          <Expand className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Expand All</span>
        </>
      ) : (
        <>
          <Minimize className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Compact View</span>
        </>
      )}
    </Button>
  );
}
