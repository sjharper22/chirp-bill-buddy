
import { useState } from "react";
import { Superbill } from "@/types/superbill";
import { useSuperbill } from "@/context/superbill-context";

/**
 * Hook to manage superbill form state
 */
export function useSuperbillState(existingSuperbill?: Superbill) {
  const { clinicDefaults } = useSuperbill();
  
  const today = new Date();
  
  // Initialize form with existing data or defaults
  const [superbill, setSuperbill] = useState<Omit<Superbill, "id" | "createdAt" | "updatedAt">>(() => {
    if (existingSuperbill) {
      return { ...existingSuperbill };
    }
    
    return {
      patientName: "",
      patientDob: today,
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
      status: 'draft'
    };
  });

  // Helper to update form fields
  const updateField = <K extends keyof typeof superbill>(
    field: K,
    value: (typeof superbill)[K]
  ) => {
    setSuperbill(prev => ({ ...prev, [field]: value }));
  };

  return {
    superbill,
    setSuperbill,
    updateField,
    isEdit: !!existingSuperbill
  };
}
