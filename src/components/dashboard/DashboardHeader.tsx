
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  selectionMode: boolean;
  selectedPatientIds: string[];
  handleToggleSelectionMode: () => void;
  handleAddSelectedToPatients: () => void;
}

export function DashboardHeader({ 
  selectionMode, 
  selectedPatientIds, 
  handleToggleSelectionMode, 
  handleAddSelectedToPatients 
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your superbills and patient statistics
        </p>
      </div>
      
      <div className="flex gap-2">
        {selectionMode && selectedPatientIds.length > 0 && (
          <Button onClick={handleAddSelectedToPatients}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add {selectedPatientIds.length} to Patients
          </Button>
        )}
        
        {!selectionMode && (
          <Button onClick={() => navigate("/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Superbill
          </Button>
        )}
      </div>
    </div>
  );
}
