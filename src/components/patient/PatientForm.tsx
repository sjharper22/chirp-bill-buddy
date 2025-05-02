
import React, { useState } from 'react';
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiTagInput } from "@/components/MultiTagInput";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertCircle } from "@/components/ui/alert";

interface PatientFormProps {
  onSubmit: (patient: Omit<PatientProfileType, "id">) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function PatientForm({ onSubmit, onCancel, isSubmitting = false }: PatientFormProps) {
  const { toast } = useToast();
  const [patient, setPatient] = useState<Omit<PatientProfileType, "id">>({
    name: "",
    dob: new Date(),
    commonIcdCodes: [],
    commonCptCodes: [],
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    dob?: string;
  }>({});
  
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
  
  const handleChange = <K extends keyof Omit<PatientProfileType, "id">>(
    field: K, 
    value: Omit<PatientProfileType, "id">[K]
  ) => {
    setPatient(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when field is updated
    if (field === 'name' || field === 'dob') {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear submit error when any field changes
    if (submitError) {
      setSubmitError(null);
    }
  };
  
  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      dob?: string;
    } = {};
    
    if (!patient.name || patient.name.trim() === '') {
      errors.name = 'Patient name is required';
    }
    
    if (!patient.dob) {
      errors.dob = 'Date of birth is required';
    } else if (!(patient.dob instanceof Date) || isNaN(patient.dob.getTime())) {
      errors.dob = 'Valid date of birth is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please correct the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitError(null);
      setIsSubmittingLocal(true);
      
      console.log("Submitting patient form with data:", patient);
      await onSubmit({
        ...patient,
        commonIcdCodes: patient.commonIcdCodes || [],
        commonCptCodes: patient.commonCptCodes || []
      });
      
      // Reset form after successful submission
      setPatient({
        name: "",
        dob: new Date(),
        commonIcdCodes: [],
        commonCptCodes: [],
      });
      
    } catch (error: any) {
      console.error("Error submitting patient form:", error);
      setSubmitError(error.message || "Failed to save patient");
      
      toast({
        title: "Error",
        description: error.message || "Failed to save patient",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingLocal(false);
    }
  };
  
  const isFormSubmitting = isSubmitting || isSubmittingLocal;
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>New Patient Profile</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 px-0">
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={validationErrors.name ? "text-destructive" : ""}>
                Patient Name
              </Label>
              <Input
                id="name"
                value={patient.name}
                onChange={e => handleChange('name', e.target.value)}
                className={validationErrors.name ? "border-destructive" : ""}
                placeholder="Enter patient name"
                disabled={isFormSubmitting}
              />
              {validationErrors.name && (
                <p className="text-destructive text-sm">{validationErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob" className={validationErrors.dob ? "text-destructive" : ""}>
                Date of Birth
              </Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  id="dob"
                  value={patient.dob ? format(patient.dob, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    if (!isNaN(date.getTime())) {
                      handleChange('dob', date);
                    }
                  }}
                  className={cn(
                    "flex-1",
                    validationErrors.dob ? "border-destructive" : ""
                  )}
                  disabled={isFormSubmitting}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      disabled={isFormSubmitting}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={patient.dob}
                      onSelect={date => date && handleChange('dob', date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      disabled={isFormSubmitting}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {validationErrors.dob && (
                <p className="text-destructive text-sm">{validationErrors.dob}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Common ICD-10 Codes</Label>
            <MultiTagInput
              value={patient.commonIcdCodes || []}
              onChange={(codes) => handleChange('commonIcdCodes', codes)}
              placeholder="Add ICD codes..."
              disabled={isFormSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Common CPT Codes</Label>
            <MultiTagInput
              value={patient.commonCptCodes || []}
              onChange={(codes) => handleChange('commonCptCodes', codes)}
              placeholder="Add CPT codes..."
              disabled={isFormSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={patient.notes || ""}
              onChange={e => handleChange('notes', e.target.value)}
              rows={3}
              disabled={isFormSubmitting}
            />
          </div>
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
