
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function PatientNameField({ value, onChange, error, disabled = false }: PatientNameFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name" className={error ? "text-destructive" : ""}>
        Patient Name
      </Label>
      <Input
        id="name"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={error ? "border-destructive" : ""}
        placeholder="Enter patient name"
        disabled={disabled}
      />
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
}
