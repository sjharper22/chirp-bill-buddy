
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientProfile } from "@/types/patient";

interface ContactInfoSectionProps {
  patient: Omit<PatientProfile, "id">;
  handleChange: <K extends keyof Omit<PatientProfile, "id">>(field: K, value: Omit<PatientProfile, "id">[K]) => void;
  disabled?: boolean;
}

export function ContactInfoSection({ patient, handleChange, disabled = false }: ContactInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Patient contact details and communication preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Primary Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={patient.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={patient.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondary_phone">Secondary Phone</Label>
            <Input
              id="secondary_phone"
              type="tel"
              value={patient.secondary_phone || ''}
              onChange={(e) => handleChange('secondary_phone', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work_phone">Work Phone</Label>
            <Input
              id="work_phone"
              type="tel"
              value={patient.work_phone || ''}
              onChange={(e) => handleChange('work_phone', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="preferred_communication">Preferred Communication</Label>
          <Select
            value={patient.preferred_communication || 'phone'}
            onValueChange={(value) => handleChange('preferred_communication', value as any)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preferred communication method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="text">Text/SMS</SelectItem>
              <SelectItem value="portal">Patient Portal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
