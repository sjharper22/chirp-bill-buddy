
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateOfBirthField } from './DateOfBirthField';
import { PatientProfile } from "@/types/patient";

interface InsuranceSectionProps {
  patient: Omit<PatientProfile, "id">;
  handleChange: <K extends keyof Omit<PatientProfile, "id">>(field: K, value: Omit<PatientProfile, "id">[K]) => void;
  disabled?: boolean;
}

export function InsuranceSection({ patient, handleChange, disabled = false }: InsuranceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Information</CardTitle>
        <CardDescription>Patient's insurance coverage details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="insurance_provider">Insurance Provider</Label>
          <Input
            id="insurance_provider"
            value={patient.insurance_provider || ''}
            onChange={(e) => handleChange('insurance_provider', e.target.value)}
            disabled={disabled}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insurance_policy_number">Policy Number</Label>
            <Input
              id="insurance_policy_number"
              value={patient.insurance_policy_number || ''}
              onChange={(e) => handleChange('insurance_policy_number', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="insurance_group_number">Group Number</Label>
            <Input
              id="insurance_group_number"
              value={patient.insurance_group_number || ''}
              onChange={(e) => handleChange('insurance_group_number', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="insurance_subscriber_name">Subscriber Name</Label>
          <Input
            id="insurance_subscriber_name"
            value={patient.insurance_subscriber_name || ''}
            onChange={(e) => handleChange('insurance_subscriber_name', e.target.value)}
            disabled={disabled}
            placeholder="If different from patient"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Subscriber Date of Birth</Label>
          <DateOfBirthField
            value={patient.insurance_subscriber_dob || new Date()}
            onChange={(date) => handleChange('insurance_subscriber_dob', date)}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
