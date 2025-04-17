
import { Visit } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { MultiSelectComplaints } from "@/components/MultiSelectComplaints";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface VisitComplaintsProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
  defaultMainComplaints?: string[];
}

export function VisitComplaints({ 
  visit, 
  onVisitChange, 
  defaultMainComplaints = [] 
}: VisitComplaintsProps) {
  const [showComplaints, setShowComplaints] = useState(false);

  const handleComplaintsChange = (complaints: string[]) => {
    onVisitChange({ ...visit, mainComplaints: complaints });
  };

  const mainComplaintsDisplay = visit.mainComplaints && visit.mainComplaints.length > 0 
    ? visit.mainComplaints.join(", ")
    : "No complaints selected";

  return (
    <div>
      <Button 
        variant="outline" 
        className="w-full justify-between text-left"
        onClick={() => setShowComplaints(!showComplaints)}
      >
        <span className="truncate">
          {mainComplaintsDisplay.length > 60 
            ? mainComplaintsDisplay.substring(0, 60) + '...' 
            : mainComplaintsDisplay}
        </span>
        {showComplaints ? 
          <ChevronUp className="h-4 w-4 shrink-0 opacity-50" /> : 
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        }
      </Button>

      {showComplaints && (
        <div className="mt-3">
          <div className="text-sm font-medium mb-2">Main Complaint(s)/Reason for Visit:</div>
          <MultiSelectComplaints
            value={visit.mainComplaints || []}
            onChange={handleComplaintsChange}
            availableOptions={defaultMainComplaints}
          />
        </div>
      )}
    </div>
  );
}
