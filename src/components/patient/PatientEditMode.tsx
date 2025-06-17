
import React, { useState, useEffect } from 'react';
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiTagInput } from "@/components/MultiTagInput";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientEditModeProps {
  patient: PatientProfileType;
  onSave: () => void;
  onCancel: () => void;
  editedPatient: PatientProfileType;
  handleChange: <K extends keyof PatientProfileType>(field: K, value: PatientProfileType[K]) => void;
}

export function PatientEditMode({ 
  patient,
  onSave,
  onCancel,
  editedPatient,
  handleChange
}: PatientEditModeProps) {
  const [displayedMonth, setDisplayedMonth] = useState<Date | undefined>(editedPatient.dob);

  useEffect(() => {
    setDisplayedMonth(editedPatient.dob);
  }, [editedPatient.dob]);

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      // Create date at noon to avoid timezone issues
      const [year, month, day] = e.target.value.split('-').map(Number);
      const date = new Date(year, month - 1, day, 12, 0, 0);
      if (!isNaN(date.getTime())) {
        handleChange('dob', date);
      }
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      // Create a new date at noon to avoid timezone issues
      const adjustedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      handleChange('dob', adjustedDate);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Patient Name</Label>
          <Input
            id="name"
            value={editedPatient.name}
            onChange={e => handleChange('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              id="dob"
              value={editedPatient.dob ? format(editedPatient.dob, "yyyy-MM-dd") : ""}
              onChange={handleDateInput}
              className="flex-1"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={editedPatient.dob}
                  onSelect={handleCalendarSelect}
                  initialFocus
                  month={displayedMonth}
                  onMonthChange={setDisplayedMonth}
                  className={cn("p-3 pointer-events-auto")}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Common ICD-10 Codes</Label>
        <MultiTagInput
          value={editedPatient.commonIcdCodes}
          onChange={(codes) => handleChange('commonIcdCodes', codes)}
          placeholder="Add ICD codes..."
        />
      </div>
      
      <div className="space-y-2">
        <Label>Common CPT Codes</Label>
        <MultiTagInput
          value={editedPatient.commonCptCodes}
          onChange={(codes) => handleChange('commonCptCodes', codes)}
          placeholder="Add CPT codes..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={editedPatient.notes || ""}
          onChange={e => handleChange('notes', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
