
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { useEffect } from "react";
import { PatientCard } from "./PatientCard";
import { PatientListActions } from "./PatientListActions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PatientListProps {
  patients: PatientProfileType[];
  selectedPatientIds: string[];
  togglePatientSelection: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  canEdit?: boolean;
  onRefresh?: () => Promise<void>;
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
  const allSelected = patients.length > 0 && selectedPatientIds.length === patients.length;
  
  // Debug patients data
  console.log("PatientList rendering with patients:", patients.length, patients);

  // Force a refresh if patients array is empty but should have items
  useEffect(() => {
    if (patients.length === 0 && onRefresh) {
      console.log("PatientList found empty patients list, triggering refresh");
      onRefresh().catch(err => console.error("Error refreshing:", err));
    }
  }, [patients.length, onRefresh]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PatientListActions 
          patientsCount={patients.length}
          selectedPatientIds={selectedPatientIds}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
          allSelected={allSelected}
        />
      </div>
      
      {patients.length === 0 ? (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No patients found. Try refreshing the list or add new patients.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              isSelected={selectedPatientIds.includes(patient.id)}
              onToggleSelection={() => togglePatientSelection(patient.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
