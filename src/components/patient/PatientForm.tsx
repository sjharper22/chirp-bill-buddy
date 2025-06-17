
import React from 'react';
import { PatientProfile } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Save } from "lucide-react";
import { usePatientForm } from './form/hooks/usePatientForm';
import { PatientNameField } from './form/PatientNameField';
import { DateOfBirthField } from './form/DateOfBirthField';
import { CodesField } from './form/CodesField';
import { NotesField } from './form/NotesField';
import { FormErrorMessage } from './form/FormErrorMessage';
import { ContactInfoSection } from './form/ContactInfoSection';
import { AddressSection } from './form/AddressSection';
import { DemographicsSection } from './form/DemographicsSection';
import { EmergencyContactSection } from './form/EmergencyContactSection';
import { InsuranceSection } from './form/InsuranceSection';
import { MedicalInfoSection } from './form/MedicalInfoSection';

interface PatientFormProps {
  onSubmit: (patient: Omit<PatientProfile, "id">) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialPatient?: Partial<PatientProfile>;
}

export function PatientForm({ onSubmit, onCancel, isSubmitting = false, initialPatient }: PatientFormProps) {
  const {
    patient,
    handleChange,
    handleSubmit,
    validationErrors,
    submitError,
    isSubmittingLocal
  } = usePatientForm(onSubmit, initialPatient);
  
  const isFormSubmitting = isSubmitting || isSubmittingLocal;
  
  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <FormErrorMessage error={submitError} />
              
              {/* Basic Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </CardContent>
              </Card>

              {/* Contact Information */}
              <ContactInfoSection
                patient={patient}
                handleChange={handleChange}
                disabled={isFormSubmitting}
              />

              {/* Address Information */}
              <AddressSection
                patient={patient}
                handleChange={handleChange}
                disabled={isFormSubmitting}
              />

              {/* Demographics */}
              <DemographicsSection
                patient={patient}
                handleChange={handleChange}
                disabled={isFormSubmitting}
              />

              {/* Emergency Contact */}
              <EmergencyContactSection
                patient={patient}
                handleChange={handleChange}
                disabled={isFormSubmitting}
              />

              {/* Insurance Information */}
              <InsuranceSection
                patient={patient}
                handleChange={handleChange}
                disabled={isFormSubmitting}
              />

              {/* Medical Information */}
              <MedicalInfoSection
                patient={patient}
                handleChange={handleChange}
                disabled={isFormSubmitting}
              />

              {/* Default Codes */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Default Medical Codes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <NotesField
                    value={patient.notes}
                    onChange={(value) => handleChange('notes', value)}
                    disabled={isFormSubmitting}
                  />
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
        
        <div className="border-t p-6 flex flex-col sm:flex-row justify-end gap-3 bg-background">
          {onCancel && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onCancel} 
              disabled={isFormSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isFormSubmitting}
            className="w-full sm:w-auto"
          >
            {isFormSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialPatient ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {initialPatient ? 'Update Patient' : 'Save Patient'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
