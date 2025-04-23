
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils/superbill-utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { PatientProfile } from "./PatientProfile";

interface PatientListProps {
  patients: PatientProfileType[];
  selectedPatientIds: string[];
  togglePatientSelection: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export function PatientList({
  patients,
  selectedPatientIds,
  togglePatientSelection,
  onSelectAll,
  onClearSelection
}: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const allSelected = patients.length > 0 && selectedPatientIds.length === patients.length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-all"
            checked={allSelected} 
            onCheckedChange={() => {
              if (allSelected) {
                onClearSelection();
              } else {
                onSelectAll();
              }
            }}
          />
          <label 
            htmlFor="select-all" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search patients..."
            className="px-3 py-2 border rounded-md text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {selectedPatientIds.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearSelection}
              className="ml-2"
            >
              Clear ({selectedPatientIds.length})
            </Button>
          )}
        </div>
      </div>
      
      <div className="border rounded-md divide-y">
        {filteredPatients.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No patients found
          </div>
        ) : (
          filteredPatients.map(patient => (
            <PatientRow
              key={patient.id}
              patient={patient}
              isSelected={selectedPatientIds.includes(patient.id)}
              onToggleSelection={() => togglePatientSelection(patient.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface PatientRowProps {
  patient: PatientProfileType;
  isSelected: boolean;
  onToggleSelection: () => void;
}

function PatientRow({ patient, isSelected, onToggleSelection }: PatientRowProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <div className={`p-4 flex items-center justify-between ${isSelected ? "bg-muted/30" : ""}`}>
      <div className="flex items-center space-x-4">
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelection} />
        
        <div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="p-0 h-auto">
                <span className="font-semibold">{patient.name}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <PatientProfile 
                patient={patient} 
                onUpdate={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <p className="text-sm text-muted-foreground">
            DOB: {formatDate(patient.dob)}
          </p>
        </div>
      </div>
      
      <div className="text-sm">
        {patient.lastSuperbillDate && (
          <p className="text-muted-foreground">
            Last superbill: {formatDate(patient.lastSuperbillDate)}
          </p>
        )}
      </div>
    </div>
  );
}
