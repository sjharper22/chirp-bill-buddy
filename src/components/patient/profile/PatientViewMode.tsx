
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { formatDate } from "@/lib/utils/superbill-utils";
import { Button } from "@/components/ui/button";

interface PatientViewModeProps {
  patient: PatientProfileType;
  onEdit: () => void;
}

export function PatientViewMode({ patient, onEdit }: PatientViewModeProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Date of Birth</p>
        <p>{formatDate(patient.dob)}</p>
      </div>
      
      {patient.lastSuperbillDate && (
        <div>
          <p className="text-sm text-muted-foreground">Last Superbill Date</p>
          <p>{formatDate(patient.lastSuperbillDate)}</p>
        </div>
      )}
      
      {patient.lastSuperbillDateRange && (
        <div>
          <p className="text-sm text-muted-foreground">Last Coverage Period</p>
          <p>
            {formatDate(patient.lastSuperbillDateRange.start)} - {formatDate(patient.lastSuperbillDateRange.end)}
          </p>
        </div>
      )}
      
      <div>
        <p className="text-sm text-muted-foreground">Common ICD-10 Codes</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {patient.commonIcdCodes.length > 0 ? 
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
          {patient.commonCptCodes.length > 0 ? 
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
