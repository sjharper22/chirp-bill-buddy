
import { useState } from "react";
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { PatientViewMode } from "./profile/PatientViewMode";
import { PatientEditMode } from "./profile/PatientEditMode";

interface PatientProfileProps {
  patient: PatientProfileType;
  onUpdate: (patient: PatientProfileType) => void;
}

export function PatientProfile({ patient, onUpdate }: PatientProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<PatientProfileType>(patient);
  
  const handleChange = <K extends keyof PatientProfileType>(
    field: K, 
    value: PatientProfileType[K]
  ) => {
    setEditedPatient(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    onUpdate(editedPatient);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{patient.name}</CardTitle>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isEditing ? (
          <PatientViewMode 
            patient={patient}
            onEdit={() => setIsEditing(true)}
          />
        ) : (
          <PatientEditMode 
            patient={patient}
            editedPatient={editedPatient}
            handleChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </CardContent>
      
      {isEditing && (
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
