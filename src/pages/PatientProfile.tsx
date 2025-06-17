
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PatientProfile as PatientProfileComponent } from "@/components/patient/PatientProfile";
import { PatientForm } from "@/components/patient/PatientForm";
import { usePatient } from "@/context/patient/patient-context";
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function PatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPatient, updatePatient, deletePatient } = usePatient();
  
  const [patient, setPatient] = useState<PatientProfileType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPatient = getPatient(id);
      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        toast({
          title: "Patient Not Found",
          description: "The requested patient could not be found.",
          variant: "destructive",
        });
        navigate("/patients");
      }
    }
  }, [id, getPatient, navigate, toast]);

  const handleUpdatePatient = async (updatedData: Omit<PatientProfileType, "id">) => {
    if (!patient) return;
    
    setIsUpdating(true);
    try {
      const updatedPatient = { ...patient, ...updatedData };
      await updatePatient(patient.id, updatedPatient);
      setPatient(updatedPatient);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Patient Updated",
        description: `${updatedData.name}'s information has been updated successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update patient",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!patient) return;
    
    setIsDeleting(true);
    try {
      await deletePatient(patient.id);
      
      toast({
        title: "Patient Deleted",
        description: `${patient.name} has been deleted successfully.`,
      });
      
      navigate("/patients");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete patient",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!patient) {
    return (
      <div className="text-center">Loading patient information...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/patients")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patients
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{patient.name}</h1>
            <p className="text-muted-foreground">Patient Profile</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Patient
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {patient.name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeletePatient}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete Patient"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Patient Profile Component */}
      <PatientProfileComponent 
        patient={patient} 
        onUpdate={() => {
          // Refresh patient data
          const refreshedPatient = getPatient(patient.id);
          if (refreshedPatient) {
            setPatient(refreshedPatient);
          }
        }} 
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] max-h-[900px] p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Edit Patient: {patient.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <PatientForm 
              onSubmit={handleUpdatePatient}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={isUpdating}
              initialPatient={patient}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
