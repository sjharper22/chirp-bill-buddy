
import React, { useState } from 'react';
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { PatientEditMode } from './PatientEditMode';
import { PatientProfileTabs } from './profile/PatientProfileTabs';
import { usePatient } from '@/context/patient/patient-context';

interface PatientProfileProps {
  patient: PatientProfileType;
  onUpdate: () => void;
}

export function PatientProfile({ patient, onUpdate }: PatientProfileProps) {
  const { updatePatient } = usePatient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPatient, setEditedPatient] = useState<PatientProfileType>(patient);

  const handleChange = <K extends keyof PatientProfileType>(field: K, value: PatientProfileType[K]) => {
    setEditedPatient(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updatePatient(patient.id, editedPatient);
    setIsEditMode(false);
    onUpdate();
  };

  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditMode(false);
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">{patient.name}</h2>
        <div className="mt-2 md:mt-0">
          {isEditMode ? (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setIsEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {isEditMode ? (
        <PatientEditMode
          patient={patient}
          onSave={handleSave}
          onCancel={handleCancel}
          editedPatient={editedPatient}
          handleChange={handleChange}
        />
      ) : (
        <PatientProfileTabs 
          patient={patient} 
          onEdit={() => setIsEditMode(true)} 
        />
      )}
    </div>
  );
}
