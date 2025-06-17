
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientProfile } from "@/types/patient";

interface EmergencyContactSectionProps {
  patient: Omit<PatientProfile, "id">;
  handleChange: <K extends keyof Omit<PatientProfile, "id">>(field: K, value: Omit<PatientProfile, "id">[K]) => void;
  disabled?: boolean;
}

export function EmergencyContactSection({ patient, handleChange, disabled = false }: EmergencyContactSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
        <CardDescription>Emergency contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_name">Contact Name</Label>
            <Input
              id="emergency_contact_name"
              value={patient.emergency_contact_name || ''}
              onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
            <Input
              id="emergency_contact_phone"
              type="tel"
              value={patient.emergency_contact_phone || ''}
              onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_relationship">Relationship</Label>
          <Input
            id="emergency_contact_relationship"
            value={patient.emergency_contact_relationship || ''}
            onChange={(e) => handleChange('emergency_contact_relationship', e.target.value)}
            disabled={disabled}
            placeholder="e.g., Spouse, Parent, Sibling"
          />
        </div>
      </CardContent>
    </Card>
  );
}
