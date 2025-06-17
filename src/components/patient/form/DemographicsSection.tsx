
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientProfile } from "@/types/patient";

interface DemographicsSectionProps {
  patient: Omit<PatientProfile, "id">;
  handleChange: <K extends keyof Omit<PatientProfile, "id">>(field: K, value: Omit<PatientProfile, "id">[K]) => void;
  disabled?: boolean;
}

export function DemographicsSection({ patient, handleChange, disabled = false }: DemographicsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demographics</CardTitle>
        <CardDescription>Patient demographic information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={patient.gender || ''}
              onValueChange={(value) => handleChange('gender', value as any)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marital_status">Marital Status</Label>
            <Select
              value={patient.marital_status || ''}
              onValueChange={(value) => handleChange('marital_status', value as any)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={patient.occupation || ''}
              onChange={(e) => handleChange('occupation', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employer">Employer</Label>
            <Input
              id="employer"
              value={patient.employer || ''}
              onChange={(e) => handleChange('employer', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patient_status">Patient Status</Label>
          <Select
            value={patient.patient_status || 'active'}
            onValueChange={(value) => handleChange('patient_status', value as any)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select patient status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="discharged">Discharged</SelectItem>
              <SelectItem value="deceased">Deceased</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
