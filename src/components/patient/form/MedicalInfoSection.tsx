
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientProfile } from "@/types/patient";

interface MedicalInfoSectionProps {
  patient: Omit<PatientProfile, "id">;
  handleChange: <K extends keyof Omit<PatientProfile, "id">>(field: K, value: Omit<PatientProfile, "id">[K]) => void;
  disabled?: boolean;
}

export function MedicalInfoSection({ patient, handleChange, disabled = false }: MedicalInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Information</CardTitle>
        <CardDescription>Patient's medical history and physician information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_care_physician">Primary Care Physician</Label>
            <Input
              id="primary_care_physician"
              value={patient.primary_care_physician || ''}
              onChange={(e) => handleChange('primary_care_physician', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referring_physician">Referring Physician</Label>
            <Input
              id="referring_physician"
              value={patient.referring_physician || ''}
              onChange={(e) => handleChange('referring_physician', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            value={patient.allergies || ''}
            onChange={(e) => handleChange('allergies', e.target.value)}
            disabled={disabled}
            rows={3}
            placeholder="List any known allergies..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="medications">Current Medications</Label>
          <Textarea
            id="medications"
            value={patient.medications || ''}
            onChange={(e) => handleChange('medications', e.target.value)}
            disabled={disabled}
            rows={3}
            placeholder="List current medications..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="medical_history">Medical History</Label>
          <Textarea
            id="medical_history"
            value={patient.medical_history || ''}
            onChange={(e) => handleChange('medical_history', e.target.value)}
            disabled={disabled}
            rows={4}
            placeholder="Relevant medical history..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
