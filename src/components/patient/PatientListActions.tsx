
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Group, CalendarRange } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PatientListActionsProps {
  patientsCount: number;
  selectedPatientIds: string[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  allSelected: boolean;
}

export function PatientListActions({
  patientsCount,
  selectedPatientIds,
  onSelectAll,
  onClearSelection,
  allSelected,
}: PatientListActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="select-all"
          checked={allSelected} 
          onCheckedChange={() => {
            if (allSelected) {
              onClearSelection();
            } else {
              onSelectAll();
            }
          }}
        />
        <label 
          htmlFor="select-all" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select All Patients ({patientsCount})
        </label>
      </div>
      
      {selectedPatientIds.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={onClearSelection}
            size="sm"
          >
            Clear Selection ({selectedPatientIds.length})
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/advanced-superbill?tab=daterange", { 
              state: { selectedPatientIds } 
            })}
            size="sm"
          >
            <CalendarRange className="h-4 w-4 mr-2" />
            Bulk Date Range
          </Button>
          <Button 
            onClick={() => navigate("/grouped-submission", { 
              state: { selectedPatientIds } 
            })}
            size="sm"
          >
            <Group className="h-4 w-4 mr-2" />
            Create Group Submission
          </Button>
        </div>
      )}
    </div>
  );
}
