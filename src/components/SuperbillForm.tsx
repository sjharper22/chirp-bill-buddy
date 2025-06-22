
import { useEffect } from "react";
import { Superbill } from "@/types/superbill";
import { PatientProfile } from "@/types/patient";
import { commonMainComplaints } from "@/constants/superbill-constants";
import { PatientInfoSection } from "@/components/superbill-form/PatientInfoSection";
import { ClinicInfoSection } from "@/components/superbill-form/ClinicInfoSection";
import { DefaultCodesSection } from "@/components/superbill-form/DefaultCodesSection";
import { VisitsSection } from "@/components/superbill-form/VisitsSection";
import { VisitPicker } from "@/components/visits/VisitPicker";
import { useSuperbillForm } from "@/components/superbill-form/hooks/useSuperbillForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";

interface SuperbillFormProps {
  existingSuperbill?: Superbill;
  prefilledPatient?: PatientProfile;
}

export function SuperbillForm({ existingSuperbill, prefilledPatient }: SuperbillFormProps) {
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
    isEdit,
    showVisitPicker,
    setShowVisitPicker,
    availableVisits,
    selectedVisitIds,
    setSelectedVisitIds,
    loadAvailableVisits,
    handleVisitSelectionConfirm
  } = useSuperbillForm(existingSuperbill, prefilledPatient);
  
  // Load available visits when patient is selected
  useEffect(() => {
    if (prefilledPatient && !isEdit) {
      loadAvailableVisits(prefilledPatient.id);
    }
  }, [prefilledPatient, isEdit]);

  const handleLoadFromVisits = async () => {
    if (!superbill.patientName) {
      alert("Please select a patient first");
      return;
    }
    
    // For now, we'll use the prefilled patient ID if available
    // In a full implementation, you'd want to look up the patient by name
    if (prefilledPatient) {
      const visits = await loadAvailableVisits(prefilledPatient.id);
      if (visits.length > 0) {
        setShowVisitPicker(true);
      } else {
        alert("No unbilled visits found for this patient");
      }
    }
  };
  
  return (
    <div className="space-y-6">
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
        
        {/* Visit Loading Option */}
        {!isEdit && prefilledPatient && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Load from Patient Visits</h3>
                  <p className="text-sm text-muted-foreground">
                    Select existing unbilled visits for this patient to include in the superbill
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLoadFromVisits}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Select Visits
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
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

      {/* Visit Picker Dialog */}
      <Dialog open={showVisitPicker} onOpenChange={setShowVisitPicker}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Visits for Superbill</DialogTitle>
          </DialogHeader>
          <VisitPicker
            visits={availableVisits}
            selectedVisitIds={selectedVisitIds}
            onSelectionChange={setSelectedVisitIds}
            onConfirm={() => handleVisitSelectionConfirm(selectedVisitIds)}
            onCancel={() => {
              setShowVisitPicker(false);
              setSelectedVisitIds([]);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
