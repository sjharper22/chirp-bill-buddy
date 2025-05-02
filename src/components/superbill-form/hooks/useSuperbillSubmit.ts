
import { useNavigate } from "react-router-dom";
import { Superbill } from "@/types/superbill";
import { useSuperbill } from "@/context/superbill-context";
import { usePatient } from "@/context/patient/patient-context";
import { generateId } from "@/lib/utils/superbill-utils";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for handling superbill form submission
 */
export function useSuperbillSubmit(
  superbill: Omit<Superbill, "id" | "createdAt" | "updatedAt">,
  existingSuperbill?: Superbill
) {
  const navigate = useNavigate();
  const { addSuperbill, updateSuperbill } = useSuperbill();
  const { addPatient, getPatient } = usePatient();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!superbill.patientName) {
      toast({
        title: "Error",
        description: "Please enter a patient name",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date();
    
    // Check if patient already exists
    const existingPatient = getPatient(superbill.patientName);
    
    // If patient doesn't exist in the patient list, add them automatically
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
      
      try {
        // Add new patient - this will handle both local and database storage
        await addPatient({
          name: superbill.patientName,
          dob: superbill.patientDob,
          lastSuperbillDate: now,
          commonIcdCodes,
          commonCptCodes,
          notes: `Automatically added from superbill creation`
        });
        
        toast({
          title: "Patient Added",
          description: `${superbill.patientName} was automatically added to your patient list.`,
        });
      } catch (error) {
        console.error("Error adding patient:", error);
        toast({
          title: "Warning",
          description: `There was an error adding the patient to your list.`,
          variant: "destructive",
        });
      }
    } else {
      // Update last superbill date for existing patient
      // Note: For now we're not updating the patient record, but this could be added if needed
    }
    
    // Continue with superbill creation/update
    if (existingSuperbill) {
      updateSuperbill(existingSuperbill.id, {
        ...superbill,
        id: existingSuperbill.id,
        createdAt: existingSuperbill.createdAt,
        updatedAt: now
      });
      
      toast({
        title: "Superbill Updated",
        description: "The superbill has been updated successfully."
      });
    } else {
      addSuperbill({
        ...superbill,
        id: generateId(),
        createdAt: now,
        updatedAt: now
      });
      
      toast({
        title: "Superbill Created",
        description: "The superbill has been created successfully."
      });
    }
    
    navigate("/");
  };
  
  return { handleSubmit };
}
