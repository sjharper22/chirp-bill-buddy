import { Visit } from "@/services/visitService";
import { PatientProfile } from "@/types/patient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisitForm } from "../VisitForm";

interface VisitDialogsProps {
  patient: PatientProfile;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  selectedVisit: Visit | null;
  onCreateDialogClose: () => void;
  onEditDialogClose: () => void;
  onCreateVisit: (visitData: any) => void;
  onUpdateVisit: (visitData: any) => void;
}

export function VisitDialogs({
  patient,
  isCreateDialogOpen,
  isEditDialogOpen,
  selectedVisit,
  onCreateDialogClose,
  onEditDialogClose,
  onCreateVisit,
  onUpdateVisit
}: VisitDialogsProps) {
  return (
    <>
      {/* Create Visit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={onCreateDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Visit for {patient.name}</DialogTitle>
          </DialogHeader>
          <VisitForm
            onSubmit={onCreateVisit}
            onCancel={onCreateDialogClose}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Visit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Visit</DialogTitle>
          </DialogHeader>
          <VisitForm
            visit={selectedVisit}
            onSubmit={onUpdateVisit}
            onCancel={onEditDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}