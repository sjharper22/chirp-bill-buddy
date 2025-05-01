
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { PatientProfile } from "./PatientProfile";
import { formatDate } from "@/lib/utils/format-utils";

interface PatientCardProps {
  patient: PatientProfileType;
  isSelected: boolean;
  onToggleSelection: () => void;
}

export function PatientCard({ patient, isSelected, onToggleSelection }: PatientCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <Card className={`relative ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-4">
        <div className="absolute top-4 left-4">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelection} />
        </div>
        
        <div className="ml-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button variant="link" className="p-0 h-auto" onClick={() => setDialogOpen(true)}>
              <span className="font-semibold text-lg">{patient.name}</span>
            </Button>
            <DialogContent className="max-w-xl">
              <PatientProfile 
                patient={patient} 
                onUpdate={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <div className="text-sm text-muted-foreground space-y-1 mt-2">
            <p>DOB: {formatDate(patient.dob)}</p>
            {patient.lastSuperbillDate && (
              <p>Last Superbill: {formatDate(patient.lastSuperbillDate)}</p>
            )}
            {patient.commonIcdCodes?.length > 0 && (
              <p>Common ICDs: {patient.commonIcdCodes.length}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
