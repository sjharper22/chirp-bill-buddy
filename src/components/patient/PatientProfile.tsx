
import { useState } from "react";
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/superbill-utils";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiTagInput } from "@/components/MultiTagInput";

interface PatientProfileProps {
  patient: PatientProfileType;
  onUpdate: (patient: PatientProfileType) => void;
}

export function PatientProfile({ patient, onUpdate }: PatientProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<PatientProfileType>(patient);
  
  const handleChange = <K extends keyof PatientProfileType>(
    field: K, 
    value: PatientProfileType[K]
  ) => {
    setEditedPatient(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    onUpdate(editedPatient);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{patient.name}</CardTitle>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p>{formatDate(patient.dob)}</p>
            </div>
            
            {patient.lastSuperbillDate && (
              <div>
                <p className="text-sm text-muted-foreground">Last Superbill Date</p>
                <p>{formatDate(patient.lastSuperbillDate)}</p>
              </div>
            )}
            
            {patient.lastSuperbillDateRange && (
              <div>
                <p className="text-sm text-muted-foreground">Last Coverage Period</p>
                <p>{formatDate(patient.lastSuperbillDateRange.start)} - {formatDate(patient.lastSuperbillDateRange.end)}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-muted-foreground">Common ICD-10 Codes</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.commonIcdCodes.length > 0 ? 
                  patient.commonIcdCodes.map(code => (
                    <div key={code} className="bg-muted px-2 py-1 rounded text-xs">
                      {code}
                    </div>
                  ))
                : 
                  <p className="text-sm italic">No common codes</p>
                }
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Common CPT Codes</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.commonCptCodes.length > 0 ? 
                  patient.commonCptCodes.map(code => (
                    <div key={code} className="bg-muted px-2 py-1 rounded text-xs">
                      {code}
                    </div>
                  ))
                : 
                  <p className="text-sm italic">No common codes</p>
                }
              </div>
            </div>
            
            {patient.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="whitespace-pre-line">{patient.notes}</p>
              </div>
            )}
          </div>
        ) : (
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
        )}
      </CardContent>
      
      {isEditing && (
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
