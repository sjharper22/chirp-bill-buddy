
import React from 'react';
import { usePatient } from "@/context/patient-context";

interface PatientListProps {
  selectedPatientId: string | null;
  onSelectPatient: (id: string) => void;
}

export function PatientList({ selectedPatientId, onSelectPatient }: PatientListProps) {
  const { patients } = usePatient();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Patients</h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {patients.map(patient => (
          <div 
            key={patient.id}
            onClick={() => onSelectPatient(patient.id)}
            className={`p-2 rounded-md cursor-pointer ${
              selectedPatientId === patient.id ? 'bg-primary text-white' : 'hover:bg-muted'
            }`}
          >
            {patient.name}
          </div>
        ))}
        {patients.length === 0 && (
          <p className="text-muted-foreground text-sm">No patients found</p>
        )}
      </div>
    </div>
  );
}
