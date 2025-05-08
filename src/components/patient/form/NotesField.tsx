
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NotesFieldProps {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function NotesField({ value, onChange, disabled = false }: NotesFieldProps) {
  // Handle click in the textarea to select all text
  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.currentTarget.select();
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        onClick={handleTextareaClick}
        rows={3}
        disabled={disabled}
      />
    </div>
  );
}
