
import { Visit } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Command } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";
import { useSuperbill } from "@/context/superbill-context";

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
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { clinicDefaults, updateClinicDefaults } = useSuperbill();

  const addComplaint = (complaint: string) => {
    if (!visit.mainComplaints.includes(complaint)) {
      const updatedComplaints = [...visit.mainComplaints, complaint];
      onVisitChange({ ...visit, mainComplaints: updatedComplaints });

      // Add to defaults if it's not already there
      if (!clinicDefaults.defaultMainComplaints.includes(complaint)) {
        const updatedDefaults = {
          ...clinicDefaults,
          defaultMainComplaints: [...clinicDefaults.defaultMainComplaints, complaint]
        };
        updateClinicDefaults(updatedDefaults);
      }

      setInputValue("");
      setOpen(false);
    }
  };

  const removeComplaint = (complaint: string) => {
    onVisitChange({
      ...visit,
      mainComplaints: visit.mainComplaints.filter(c => c !== complaint)
    });
  };

  const filteredComplaints = defaultMainComplaints.filter(complaint => {
    const search = inputValue.toLowerCase();
    return complaint.toLowerCase().includes(search);
  });

  const toggleComplaints = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowComplaints(!showComplaints);
  };

  const handleCustomComplaintAdd = () => {
    if (inputValue && !visit.mainComplaints.includes(inputValue)) {
      addComplaint(inputValue);
    }
  };

  const mainComplaintsDisplay = visit.mainComplaints && visit.mainComplaints.length > 0 
    ? visit.mainComplaints.join(", ")
    : "No complaints selected";

  return (
    <div>
      <Button 
        type="button"
        variant="outline" 
        className="w-full justify-between text-left"
        onClick={toggleComplaints}
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
          
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-[300px] justify-start">
                <Search className="mr-2 h-4 w-4" />
                Search or add complaint
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <div className="flex items-center border-b px-3">
                  <Search className="h-4 w-4 shrink-0 opacity-50" />
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type to search..."
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map(complaint => (
                      <div
                        key={complaint}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                        onClick={() => {
                          addComplaint(complaint);
                          setOpen(false);
                        }}
                      >
                        {complaint}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">
                      {inputValue ? (
                        <div className="space-y-2">
                          <p>No existing complaints found.</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleCustomComplaintAdd}
                          >
                            Add "{inputValue}" as new complaint
                          </Button>
                        </div>
                      ) : (
                        "Type to search for complaints..."
                      )}
                    </div>
                  )}
                </div>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex flex-wrap gap-2 mt-2">
            {visit.mainComplaints.map(complaint => (
              <Badge 
                key={complaint} 
                variant="secondary" 
                className="cursor-pointer hover:bg-muted"
                onClick={() => removeComplaint(complaint)}
              >
                {complaint}
                <span className="ml-1 text-muted-foreground">×</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
