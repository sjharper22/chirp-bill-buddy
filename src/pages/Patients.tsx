
import { useState } from "react";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { PatientList } from "@/components/patient/PatientList";
import { PatientForm } from "@/components/patient/PatientForm";
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export default function Patients() {
  const navigate = useNavigate();
  const { 
    patients, 
    addPatient, 
    updatePatient,
    selectedPatientIds,
    togglePatientSelection,
    selectAllPatients,
    clearPatientSelection
  } = usePatient();
  
  const { superbills } = useSuperbill();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Handler for adding a new patient
  const handleAddPatient = (patientData: Omit<PatientProfileType, "id">) => {
    addPatient(patientData);
    setDialogOpen(false);
    toast({
      title: "Patient Added",
      description: `${patientData.name} has been added successfully.`,
    });
  };
  
  // Get superbills for selected patients
  const selectedSuperbills = superbills.filter(bill => 
    selectedPatientIds.includes(patients.find(p => p.name === bill.patientName)?.id || '')
  );
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Patient Profiles</h1>
          <p className="text-muted-foreground">
            Manage patient profiles and group patients for insurance submissions
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>New Patient</DialogTitle>
              </DialogHeader>
              <PatientForm 
                onSubmit={handleAddPatient}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          {selectedPatientIds.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => navigate("/grouped-submission", { 
                state: { selectedPatientIds } 
              })}
            >
              Create Group Submission ({selectedPatientIds.length})
            </Button>
          )}
        </div>
      </div>
      
      {patients.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <User className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-lg font-medium mt-4 mb-2">No patients added yet</p>
          <p className="text-muted-foreground mb-6">
            Add patient profiles to streamline your superbill creation process
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Patient
          </Button>
        </div>
      ) : (
        <PatientList
          patients={patients}
          selectedPatientIds={selectedPatientIds}
          togglePatientSelection={togglePatientSelection}
          onSelectAll={selectAllPatients}
          onClearSelection={clearPatientSelection}
        />
      )}
    </div>
  );
}
