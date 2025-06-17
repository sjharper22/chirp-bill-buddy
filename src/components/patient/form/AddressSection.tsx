
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientProfile } from "@/types/patient";

interface AddressSectionProps {
  patient: Omit<PatientProfile, "id">;
  handleChange: <K extends keyof Omit<PatientProfile, "id">>(field: K, value: Omit<PatientProfile, "id">[K]) => void;
  disabled?: boolean;
}

export function AddressSection({ patient, handleChange, disabled = false }: AddressSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
        <CardDescription>Patient's residential address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address_line1">Address Line 1</Label>
          <Input
            id="address_line1"
            value={patient.address_line1 || ''}
            onChange={(e) => handleChange('address_line1', e.target.value)}
            disabled={disabled}
            placeholder="Street address"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address_line2">Address Line 2</Label>
          <Input
            id="address_line2"
            value={patient.address_line2 || ''}
            onChange={(e) => handleChange('address_line2', e.target.value)}
            disabled={disabled}
            placeholder="Apartment, suite, etc. (optional)"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={patient.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              value={patient.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zip_code">ZIP/Postal Code</Label>
            <Input
              id="zip_code"
              value={patient.zip_code || ''}
              onChange={(e) => handleChange('zip_code', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={patient.country || 'US'}
            onChange={(e) => handleChange('country', e.target.value)}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
