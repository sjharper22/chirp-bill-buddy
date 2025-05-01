
import { useState } from "react";
import { SuperbillStatus } from "@/types/superbill";
import { useSuperbill } from "@/context/superbill-context";
import { usePatient } from "@/context/patient-context";
import { toast } from "@/components/ui/use-toast";

export function useDashboard() {
  const { superbills, deleteSuperbill, updateSuperbillStatus } = useSuperbill();
  const { patients, addPatient, getPatient } = usePatient();
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

  const handleAddSelectedToPatients = () => {
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

    selectedPatientIds.forEach(id => {
      const superbill = superbills.find(bill => bill.id === id);
      
      if (superbill) {
        const existingPatient = getPatient(superbill.patientName);
        
        if (!existingPatient) {
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
          
          // Add patient
          addPatient({
            name: superbill.patientName,
            dob: superbill.patientDob,
            lastSuperbillDate: superbill.issueDate,
            commonIcdCodes,
            commonCptCodes,
            notes: `Created from superbill ${superbill.id}`
          });
          
          addedCount++;
        } else {
          skippedCount++;
        }
      }
    });
    
    toast({
      title: `${addedCount} patients added to your list`,
      description: skippedCount > 0 ? `${skippedCount} patients were already in your patient list.` : "",
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
