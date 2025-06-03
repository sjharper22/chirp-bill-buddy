
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { PatientProfile } from "./PatientProfile";
import { formatDate } from "@/lib/utils/format-utils";
import { Trash, Plus, Eye } from "lucide-react";
import { usePatient } from "@/context/patient/patient-context";
import { Link } from "react-router-dom";

interface PatientCardProps {
  patient: PatientProfileType;
  isSelected: boolean;
  onToggleSelection: () => void;
}

export function PatientCard({ patient, isSelected, onToggleSelection }: PatientCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { deletePatient } = usePatient();
  
  const handleDelete = async () => {
    try {
      await deletePatient(patient.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };
  
  return (
    <Card className={`relative ${isSelected ? "ring-2 ring-primary" : ""} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="absolute top-4 left-4">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelection} />
        </div>
        
        <div className="ml-8">
          <div className="flex justify-between items-start mb-3">
            <Button variant="link" className="p-0 h-auto text-left" onClick={() => setDialogOpen(true)}>
              <span className="font-semibold text-lg hover:underline">{patient.name}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive" 
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1 mb-4">
            <p>DOB: {formatDate(patient.dob)}</p>
            {patient.lastSuperbillDate && (
              <p>Last Superbill: {formatDate(patient.lastSuperbillDate)}</p>
            )}
            {patient.commonIcdCodes?.length > 0 && (
              <p>Common ICDs: {patient.commonIcdCodes.length}</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/new" state={{ prefilledPatient: patient }}>
                <Plus className="mr-2 h-4 w-4" />
                New Superbill
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <PatientProfile 
            patient={patient} 
            onUpdate={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {patient.name}? This action cannot be undone and will remove the patient from both your local list and the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
