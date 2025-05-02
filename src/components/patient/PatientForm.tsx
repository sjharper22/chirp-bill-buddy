
import React from 'react';
import { PatientProfile } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { usePatientForm } from './form/usePatientForm';
import { PatientNameField } from './form/PatientNameField';
import { DateOfBirthField } from './form/DateOfBirthField';
import { CodesField } from './form/CodesField';
import { NotesField } from './form/NotesField';
import { FormErrorMessage } from './form/FormErrorMessage';

interface PatientFormProps {
  onSubmit: (patient: Omit<PatientProfile, "id">) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function PatientForm({ onSubmit, onCancel, isSubmitting = false }: PatientFormProps) {
  const {
    patient,
    handleChange,
    handleSubmit,
    validationErrors,
    submitError,
    isSubmittingLocal
  } = usePatientForm(onSubmit);
  
  const isFormSubmitting = isSubmitting || isSubmittingLocal;
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>New Patient Profile</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 px-0">
          <FormErrorMessage error={submitError} />
          
          <div className="grid grid-cols-1 gap-4">
            <PatientNameField 
              value={patient.name}
              onChange={(value) => handleChange('name', value)}
              error={validationErrors.name}
              disabled={isFormSubmitting}
            />
            
            <DateOfBirthField
              value={patient.dob}
              onChange={(date) => handleChange('dob', date)}
              error={validationErrors.dob}
              disabled={isFormSubmitting}
            />
          </div>
          
          <CodesField
            label="Common ICD-10 Codes"
            codes={patient.commonIcdCodes || []}
            onChange={(codes) => handleChange('commonIcdCodes', codes)}
            placeholder="Add ICD codes..."
            disabled={isFormSubmitting}
          />
          
          <CodesField
            label="Common CPT Codes"
            codes={patient.commonCptCodes || []}
            onChange={(codes) => handleChange('commonCptCodes', codes)}
            placeholder="Add CPT codes..."
            disabled={isFormSubmitting}
          />
          
          <NotesField
            value={patient.notes}
            onChange={(value) => handleChange('notes', value)}
            disabled={isFormSubmitting}
          />
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 border-t pt-4 px-0">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isFormSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isFormSubmitting}>
            {isFormSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Patient
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
