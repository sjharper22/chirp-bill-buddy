
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NotesFieldProps {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function NotesField({ value, onChange, disabled = false }: NotesFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        rows={3}
        disabled={disabled}
      />
    </div>
  );
}
