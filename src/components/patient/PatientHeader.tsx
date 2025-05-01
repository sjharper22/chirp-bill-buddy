
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { PatientForm } from "@/components/patient/PatientForm";
import { PatientProfile } from "@/types/patient";
import { useNavigate } from "react-router-dom";

interface PatientHeaderProps {
  canEdit: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onAddPatient: (patient: Omit<PatientProfile, "id">) => Promise<void>; // Updated return type
  selectedPatientIds: string[];
}

export function PatientHeader({
  canEdit,
  dialogOpen,
  setDialogOpen,
  onAddPatient,
  selectedPatientIds
}: PatientHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Patient Profiles</h1>
        <p className="text-muted-foreground">
          Manage patient profiles and group patients for insurance submissions
        </p>
      </div>
      
      <div className="flex gap-2">
        {canEdit && (
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
                onSubmit={onAddPatient}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
        
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
  );
}
