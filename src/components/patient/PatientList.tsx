
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, Group, ClipboardList } from "lucide-react";
import { useState } from "react";
import { PatientProfile } from "./PatientProfile";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/superbill-utils";

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const allSelected = patients.length > 0 && selectedPatientIds.length === patients.length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
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
            Select All Patients ({filteredPatients.length})
          </label>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search patients..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {selectedPatientIds.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={onClearSelection}
                size="sm"
              >
                Clear Selection ({selectedPatientIds.length})
              </Button>
              <Button 
                onClick={() => navigate("/grouped-submission", { 
                  state: { selectedPatientIds } 
                })}
                size="sm"
              >
                <Group className="h-4 w-4 mr-2" />
                Create Group Submission
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-lg font-medium mt-4 mb-2">No patients found</p>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Add your first patient to get started"}
            </p>
          </div>
        ) : (
          filteredPatients.map(patient => (
            <PatientCard
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

interface PatientCardProps {
  patient: PatientProfileType;
  isSelected: boolean;
  onToggleSelection: () => void;
}

function PatientCard({ patient, isSelected, onToggleSelection }: PatientCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <Card className={`relative ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-4">
        <div className="absolute top-4 left-4">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelection} />
        </div>
        
        <div className="ml-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="p-0 h-auto">
                <span className="font-semibold text-lg">{patient.name}</span>
              </Button>
            </DialogTrigger>
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
