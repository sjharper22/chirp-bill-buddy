
import { Superbill } from "@/types/superbill";
import { commonMainComplaints } from "@/constants/superbill-constants";
import { PatientInfoSection } from "@/components/superbill-form/PatientInfoSection";
import { ClinicInfoSection } from "@/components/superbill-form/ClinicInfoSection";
import { DefaultCodesSection } from "@/components/superbill-form/DefaultCodesSection";
import { VisitsSection } from "@/components/superbill-form/VisitsSection";
import { useSuperbillForm } from "@/components/superbill-form/hooks/useSuperbillForm";

interface SuperbillFormProps {
  existingSuperbill?: Superbill;
}

export function SuperbillForm({ existingSuperbill }: SuperbillFormProps) {
  const {
    superbill,
    handleSubmit,
    updateField,
    updateVisit,
    addVisit,
    duplicateVisit,
    deleteVisit,
    updateVisitsWithDefaults,
    totalFee,
    isEdit
  } = useSuperbillForm(existingSuperbill);
  
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
        isEdit={isEdit}
        onSubmit={handleSubmit}
      />
    </form>
  );
}
