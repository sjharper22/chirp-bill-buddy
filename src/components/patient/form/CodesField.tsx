
import React from "react";
import { MultiTagInput } from "@/components/MultiTagInput";
import { Label } from "@/components/ui/label";

interface CodesFieldProps {
  label: string;
  codes: string[];
  onChange: (codes: string[]) => void;
  placeholder: string;
  disabled?: boolean;
}

export function CodesField({ label, codes, onChange, placeholder, disabled = false }: CodesFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <MultiTagInput
        value={codes}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
