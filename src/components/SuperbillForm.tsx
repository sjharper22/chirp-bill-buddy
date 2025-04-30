
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Superbill, Visit } from "@/types/superbill";
import { useSuperbill } from "@/context/superbill-context";
import { 
  generateId, 
  createEmptyVisit, 
  calculateTotalFee, 
} from "@/lib/utils/superbill-utils";
import { PatientInfoSection } from "@/components/superbill-form/PatientInfoSection";
import { ClinicInfoSection } from "@/components/superbill-form/ClinicInfoSection";
import { DefaultCodesSection } from "@/components/superbill-form/DefaultCodesSection";
import { VisitsSection } from "@/components/superbill-form/VisitsSection";
import { commonMainComplaints } from "@/constants/superbill-constants";

interface SuperbillFormProps {
  existingSuperbill?: Superbill;
}

export function SuperbillForm({ existingSuperbill }: SuperbillFormProps) {
  const navigate = useNavigate();
  const { addSuperbill, updateSuperbill, clinicDefaults } = useSuperbill();
  
  const today = new Date();
  
  // Initialize form with existing data or defaults
  const [superbill, setSuperbill] = useState<Omit<Superbill, "id" | "createdAt" | "updatedAt">>(() => {
    if (existingSuperbill) {
      return { ...existingSuperbill };
    }
    
    return {
      patientName: "",
      patientDob: new Date(),
      issueDate: today,
      clinicName: clinicDefaults.clinicName,
      clinicAddress: clinicDefaults.clinicAddress,
      clinicPhone: clinicDefaults.clinicPhone,
      clinicEmail: clinicDefaults.clinicEmail,
      ein: clinicDefaults.ein,
      npi: clinicDefaults.npi,
      providerName: clinicDefaults.providerName,
      defaultIcdCodes: [...clinicDefaults.defaultIcdCodes],
      defaultCptCodes: [...clinicDefaults.defaultCptCodes],
      defaultMainComplaints: [...(clinicDefaults.defaultMainComplaints || [])],
      defaultFee: clinicDefaults.defaultFee,
      visits: [],
      status: 'draft' // Added the status property with default value 'draft'
    };
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!superbill.patientName) {
      alert("Please enter a patient name");
      return;
    }
    
    const now = new Date();
    
    if (existingSuperbill) {
      updateSuperbill(existingSuperbill.id, {
        ...superbill,
        id: existingSuperbill.id,
        createdAt: existingSuperbill.createdAt,
        updatedAt: now
      });
    } else {
      addSuperbill({
        ...superbill,
        id: generateId(),
        createdAt: now,
        updatedAt: now
      });
    }
    
    navigate("/");
  };
  
  // Update form fields
  const updateField = <K extends keyof typeof superbill>(
    field: K,
    value: (typeof superbill)[K]
  ) => {
    setSuperbill(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle updates to visits array
  const updateVisit = (updatedVisit: Visit) => {
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.map(visit => 
        visit.id === updatedVisit.id ? updatedVisit : visit
      )
    }));
  };
  
  // Add a new visit
  const addVisit = () => {
    const newVisit = createEmptyVisit(
      superbill.defaultIcdCodes,
      superbill.defaultCptCodes,
      superbill.defaultFee
    );
    
    // If there are default main complaints, use the first one
    if (superbill.defaultMainComplaints && superbill.defaultMainComplaints.length > 0) {
      newVisit.mainComplaints = [superbill.defaultMainComplaints[0]];
    }
    
    setSuperbill(prev => ({
      ...prev,
      visits: [...prev.visits, newVisit]
    }));
  };
  
  // Duplicate a visit
  const duplicateVisit = (visit: Visit) => {
    setSuperbill(prev => ({
      ...prev,
      visits: [...prev.visits, { ...visit, id: generateId() }]
    }));
  };
  
  // Delete a visit
  const deleteVisit = (id: string) => {
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.filter(visit => visit.id !== id)
    }));
  };
  
  // Update all visits when default codes/fee change
  const updateVisitsWithDefaults = () => {
    if (superbill.visits.length === 0) return;
    
    if (!confirm("Update all existing visits with these default values?")) {
      return;
    }
    
    setSuperbill(prev => ({
      ...prev,
      visits: prev.visits.map(visit => ({
        ...visit,
        icdCodes: [...prev.defaultIcdCodes],
        cptCodes: [...prev.defaultCptCodes],
        // Don't update mainComplaint automatically
        fee: prev.defaultFee
      }))
    }));
  };
  
  // Calculate total fee
  const totalFee = calculateTotalFee(superbill.visits);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Information */}
      <PatientInfoSection 
        superbill={superbill} 
        updateField={updateField} 
      />
      
      {/* Clinic Information */}
      <ClinicInfoSection 
        superbill={superbill} 
        updateField={updateField} 
      />
      
      {/* Default Code Settings */}
      <DefaultCodesSection 
        superbill={superbill} 
        updateField={updateField} 
        commonMainComplaints={commonMainComplaints}
        updateVisitsWithDefaults={updateVisitsWithDefaults}
      />
      
      {/* Visit Entries */}
      <VisitsSection 
        superbill={superbill}
        updateVisit={updateVisit}
        addVisit={addVisit}
        duplicateVisit={duplicateVisit}
        deleteVisit={deleteVisit}
        totalFee={totalFee}
        isEdit={!!existingSuperbill}
        onSubmit={handleSubmit}
      />
    </form>
  );
}
