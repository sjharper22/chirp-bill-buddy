
import React from 'react';
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { formatDate } from "@/lib/utils/format-utils";

interface PatientViewModeProps {
  patient: PatientProfileType;
  onEdit: () => void;
}

export function PatientViewMode({ patient, onEdit }: PatientViewModeProps) {
  // Safely format dates - ensure they're valid dates first
  const formatDateSafely = (date: Date | undefined) => {
    if (!date) return "Not available";
    
    // Check if it's a valid date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    
    return formatDate(dateObj);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Date of Birth</p>
        <p>{formatDateSafely(patient.dob)}</p>
      </div>
      
      {patient.lastSuperbillDate && (
        <div>
          <p className="text-sm text-muted-foreground">Last Superbill Date</p>
          <p>{formatDateSafely(patient.lastSuperbillDate)}</p>
        </div>
      )}
      
      {patient.lastSuperbillDateRange && (
        <div>
          <p className="text-sm text-muted-foreground">Last Coverage Period</p>
          <p>
            {formatDateSafely(patient.lastSuperbillDateRange.start)} - {formatDateSafely(patient.lastSuperbillDateRange.end)}
          </p>
        </div>
      )}
      
      <div>
        <p className="text-sm text-muted-foreground">Common ICD-10 Codes</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {patient.commonIcdCodes && patient.commonIcdCodes.length > 0 ? 
            patient.commonIcdCodes.map(code => (
              <div key={code} className="bg-muted px-2 py-1 rounded text-xs">
                {code}
              </div>
            ))
          : 
            <p className="text-sm italic">No common codes</p>
          }
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground">Common CPT Codes</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {patient.commonCptCodes && patient.commonCptCodes.length > 0 ? 
            patient.commonCptCodes.map(code => (
              <div key={code} className="bg-muted px-2 py-1 rounded text-xs">
                {code}
              </div>
            ))
          : 
            <p className="text-sm italic">No common codes</p>
          }
        </div>
      </div>
      
      {patient.notes && (
        <div>
          <p className="text-sm text-muted-foreground">Notes</p>
          <p className="whitespace-pre-line">{patient.notes}</p>
        </div>
      )}
    </div>
  );
}
