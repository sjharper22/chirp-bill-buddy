
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PatientProfile } from "@/types/patient"; 
import { PatientForm } from "./PatientForm";
import { UserPlus, RefreshCcw } from "lucide-react";

interface PatientHeaderProps {
  canEdit: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onAddPatient: (patient: Omit<PatientProfile, "id">) => Promise<void>;
  selectedPatientIds: string[];
  isAddingPatient?: boolean;
}

export function PatientHeader({
  canEdit,
  dialogOpen,
  setDialogOpen,
  onAddPatient,
  selectedPatientIds,
  isAddingPatient = false
}: PatientHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Patients</h1>
        <p className="text-muted-foreground">Manage your patient profiles</p>
      </div>

      {canEdit && (
        <div className="flex gap-2">
          <Button onClick={() => setDialogOpen(true)} disabled={isAddingPatient}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] max-h-[900px] p-0 overflow-hidden">
          <div className="p-6 border-b">
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Create a new patient record to manage their visits and superbills.
            </DialogDescription>
          </div>
          <div className="flex-1 overflow-hidden">
            <PatientForm 
              onSubmit={onAddPatient} 
              onCancel={() => setDialogOpen(false)}
              isSubmitting={isAddingPatient}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
