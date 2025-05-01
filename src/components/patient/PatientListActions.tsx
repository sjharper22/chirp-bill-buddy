
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Group } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PatientListActionsProps {
  patientsCount: number;
  selectedPatientIds: string[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  allSelected: boolean;
}

export function PatientListActions({
  patientsCount,
  selectedPatientIds,
  searchTerm,
  onSearchChange,
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
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search patients..."
            className="pl-10"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
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
    </div>
  );
}
