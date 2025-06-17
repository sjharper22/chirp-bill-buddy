
import React from 'react';
import { PatientProfile } from "@/types/patient";
import { PatientCard } from "./PatientCard";
import { useAuth } from "@/context/auth-context";

interface PatientListProps {
  patients: PatientProfile[];
  selectedPatientIds: string[];
  onToggleSelection: (id: string) => void;
}

export function PatientList({ patients, selectedPatientIds, onToggleSelection }: PatientListProps) {
  const { isAdmin, isEditor } = useAuth();
  const canEdit = isAdmin || isEditor;

  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No patients found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          isSelected={selectedPatientIds.includes(patient.id)}
          onToggleSelection={() => onToggleSelection(patient.id)}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}
