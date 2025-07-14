
import { useState } from "react";
import { Superbill } from "@/types/superbill";
import { PatientProfile } from "@/types/patient";
import { useSuperbill } from "@/context/superbill-context";

/**
 * Hook to manage superbill form state
 */
export function useSuperbillState(existingSuperbill?: Superbill, prefilledPatient?: PatientProfile) {
  const { clinicDefaults } = useSuperbill();
  
  const today = new Date();
  
  // Initialize form with existing data or defaults
  const [superbill, setSuperbill] = useState<Omit<Superbill, "id" | "createdAt" | "updatedAt">>(() => {
    if (existingSuperbill) {
      return { ...existingSuperbill };
    }
    
    return {
      patientName: prefilledPatient?.name || "",
      patientDob: prefilledPatient?.dob || today,
      issueDate: today,
      clinicName: clinicDefaults.clinicName,
      clinicAddress: clinicDefaults.clinicAddress,
      clinicPhone: clinicDefaults.clinicPhone,
      clinicEmail: clinicDefaults.clinicEmail,
      ein: clinicDefaults.ein,
      npi: clinicDefaults.npi,
      providerName: clinicDefaults.providerName,
      defaultIcdCodes: prefilledPatient?.commonIcdCodes?.length ? [...prefilledPatient.commonIcdCodes] : [...clinicDefaults.defaultIcdCodes],
      defaultCptCodes: prefilledPatient?.commonCptCodes?.length ? [...prefilledPatient.commonCptCodes] : [...clinicDefaults.defaultCptCodes],
      defaultMainComplaints: [],
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
