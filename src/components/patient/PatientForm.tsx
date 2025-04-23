
import { useState } from "react";
import { PatientProfileFormData } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiTagInput } from "@/components/MultiTagInput";

interface PatientFormProps {
  onSubmit: (patient: PatientProfileFormData) => void;
  onCancel?: () => void;
}

export function PatientForm({ onSubmit, onCancel }: PatientFormProps) {
  const [patient, setPatient] = useState<PatientProfileFormData>({
    name: "",
    dob: new Date(),
    commonIcdCodes: [],
    commonCptCodes: [],
  });
  
  const handleChange = <K extends keyof PatientProfileFormData>(
    field: K, 
    value: PatientProfileFormData[K]
  ) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(patient);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>New Patient Profile</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Patient Name</Label>
              <Input
                id="name"
                value={patient.name}
                onChange={e => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  id="dob"
                  value={patient.dob ? format(patient.dob, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    if (!isNaN(date.getTime())) {
                      handleChange('dob', date);
                    }
                  }}
                  className="flex-1"
                  required
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
                      selected={patient.dob}
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
              value={patient.commonIcdCodes}
              onChange={(codes) => handleChange('commonIcdCodes', codes)}
              placeholder="Add ICD codes..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Common CPT Codes</Label>
            <MultiTagInput
              value={patient.commonCptCodes}
              onChange={(codes) => handleChange('commonCptCodes', codes)}
              placeholder="Add CPT codes..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={patient.notes || ""}
              onChange={e => handleChange('notes', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Patient
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
