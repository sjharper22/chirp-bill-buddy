
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiTagInput } from "@/components/MultiTagInput";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
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
              onChange={(e) => {
                const date = new Date(e.target.value);
                if (!isNaN(date.getTime())) {
                  handleChange('dob', date);
                }
              }}
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
                  onSelect={date => date && handleChange('dob', date)}
                  initialFocus
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
