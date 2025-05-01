
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { useState } from "react";
import { PatientCard } from "./PatientCard";
import { PatientListActions } from "./PatientListActions";
import { PatientEmptyResults } from "./PatientEmptyResults";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PatientListProps {
  patients: PatientProfileType[];
  selectedPatientIds: string[];
  togglePatientSelection: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  canEdit?: boolean;
  onRefresh?: () => Promise<void>; // Updated return type
}

export function PatientList({
  patients,
  selectedPatientIds,
  togglePatientSelection,
  onSelectAll,
  onClearSelection,
  canEdit = false,
  onRefresh
}: PatientListProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const allSelected = patients.length > 0 && selectedPatientIds.length === patients.length;
  
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        toast({
          title: "Success",
          description: "Patient list refreshed successfully",
        });
      } catch (error) {
        console.error("Error refreshing patients:", error);
        toast({
          title: "Error",
          description: "Failed to refresh patient list",
          variant: "destructive",
        });
      } finally {
        setIsRefreshing(false);
      }
    }
  };
  
  // Debug patients data
  console.log("PatientList rendering with patients:", patients);
  console.log("Filtered patients:", filteredPatients);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PatientListActions 
          patientsCount={filteredPatients.length}
          selectedPatientIds={selectedPatientIds}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
          allSelected={allSelected}
        />
        
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Patients'}
          </Button>
        )}
      </div>
      
      {patients.length > 0 && filteredPatients.length === 0 && (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No patients match your search criteria. Try adjusting your search or clear it to see all patients.
          </AlertDescription>
        </Alert>
      )}

      {patients.length === 0 ? (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No patients found. Try refreshing the list or add new patients.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.length === 0 ? (
            <PatientEmptyResults searchTerm={searchTerm} />
          ) : (
            filteredPatients.map(patient => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isSelected={selectedPatientIds.includes(patient.id)}
                onToggleSelection={() => togglePatientSelection(patient.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
