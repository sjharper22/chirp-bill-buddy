
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { useState } from "react";
import { PatientCard } from "./PatientCard";
import { PatientListActions } from "./PatientListActions";
import { PatientEmptyResults } from "./PatientEmptyResults";

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
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const allSelected = patients.length > 0 && selectedPatientIds.length === patients.length;
  
  return (
    <div className="space-y-4">
      <PatientListActions 
        patientsCount={filteredPatients.length}
        selectedPatientIds={selectedPatientIds}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
        allSelected={allSelected}
      />
      
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
    </div>
  );
}
