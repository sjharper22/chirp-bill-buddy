
import { useState } from "react";
import { SuperbillStatus } from "@/types/superbill";
import { useSuperbill } from "@/context/superbill-context";
import { usePatient } from "@/context/patient-context";
import { useToast } from "@/components/ui/use-toast";
import { patientService } from "@/services/patientService";

export function useDashboard() {
  const { superbills, deleteSuperbill, updateSuperbillStatus } = useSuperbill();
  const { patients, addPatient, getPatient } = usePatient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  
  // Calculate total visits across all superbills
  const totalVisits = superbills.reduce((total, bill) => total + bill.visits.length, 0);
  
  // Calculate total billed amount
  const totalBilled = superbills.reduce((total, bill) => {
    return total + bill.visits.reduce((visitTotal, visit) => visitTotal + visit.fee, 0);
  }, 0);
  
  // Calculate average fee per visit
  const averageFee = totalVisits > 0 ? totalBilled / totalVisits : 0;
  
  const handleDeleteSuperbill = (id: string) => {
    deleteSuperbill(id);
    toast({
      title: "Superbill deleted",
      description: "The superbill has been deleted successfully.",
    });
  };

  const handleStatusChange = (id: string, newStatus: SuperbillStatus) => {
    updateSuperbillStatus(id, newStatus);
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedPatientIds([]);
  };

  const handleSelectPatient = (id: string, name: string, dob: Date, selected: boolean) => {
    setSelectedPatientIds(prev => {
      if (selected) {
        return [...prev, id];
      } else {
        return prev.filter(patientId => patientId !== id);
      }
    });
  };

  const handleAddSelectedToPatients = async () => {
    if (selectedPatientIds.length === 0) {
      toast({
        title: "No patients selected",
        description: "Please select at least one patient to add to your patient list.",
        variant: "destructive",
      });
      return;
    }

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Create an array to track promises
    const promises = [];

    for (const id of selectedPatientIds) {
      const superbill = superbills.find(bill => bill.id === id);
      
      if (superbill) {
        const existingPatient = getPatient(superbill.patientName);
        
        if (!existingPatient) {
          try {
            // Extract common complaints from visits
            const commonComplaints: string[] = [];
            superbill.visits.forEach(visit => {
              if (visit.mainComplaints) {
                visit.mainComplaints.forEach(complaint => {
                  if (!commonComplaints.includes(complaint)) {
                    commonComplaints.push(complaint);
                  }
                });
              }
            });
            
            // Extract ICD and CPT codes
            const commonIcdCodes: string[] = [];
            const commonCptCodes: string[] = [];
            
            superbill.visits.forEach(visit => {
              visit.icdCodes.forEach(code => {
                if (!commonIcdCodes.includes(code)) {
                  commonIcdCodes.push(code);
                }
              });
              
              visit.cptCodes.forEach(code => {
                if (!commonCptCodes.includes(code)) {
                  commonCptCodes.push(code);
                }
              });
            });
            
            // Create the patient data object
            const patientData = {
              name: superbill.patientName,
              dob: superbill.patientDob,
              lastSuperbillDate: superbill.issueDate,
              commonIcdCodes,
              commonCptCodes,
              notes: `Created from superbill ${superbill.id}`
            };
            
            // Create promise for database operation but execute add immediately
            const newPatient = addPatient(patientData);
            
            const promise = patientService.create(patientData)
              .then(() => {
                console.log("Patient added successfully:", patientData.name);
                addedCount++;
              })
              .catch((error) => {
                console.error("Error saving patient to database:", error);
                errorCount++;
              });
              
            promises.push(promise);
          } catch (error) {
            console.error("Error adding patient:", error);
            errorCount++;
          }
        } else {
          console.log("Patient already exists:", superbill.patientName);
          skippedCount++;
        }
      }
    }
    
    // Wait for all promises to resolve
    await Promise.all(promises);
    
    toast({
      title: `${addedCount} patients added to your list`,
      description: skippedCount > 0 
        ? `${skippedCount} patients were already in your patient list.${errorCount > 0 ? ` ${errorCount} errors occurred.` : ''}` 
        : errorCount > 0 ? `${errorCount} errors occurred while saving patients.` : "",
      variant: addedCount > 0 ? "default" : "destructive",
    });
    
    // Exit selection mode
    setSelectionMode(false);
    setSelectedPatientIds([]);
  };

  return {
    superbills,
    patients,
    searchTerm,
    setSearchTerm,
    selectionMode,
    selectedPatientIds,
    totalVisits,
    totalBilled,
    averageFee,
    handleDeleteSuperbill,
    handleStatusChange,
    handleToggleSelectionMode,
    handleSelectPatient,
    handleAddSelectedToPatients
  };
}
