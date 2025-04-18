
import { Superbill } from "@/types/superbill";
import { formatDate } from "@/lib/utils/superbill-utils";

interface InfoSectionProps {
  superbill: Superbill;
  earliestDate: Date | null;
  latestDate: Date | null;
}

export function InfoSection({ superbill, earliestDate, latestDate }: InfoSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <h3 className="font-semibold mb-2">Patient Information</h3>
        <p><span className="font-medium">Name:</span> {superbill.patientName}</p>
        <p><span className="font-medium">DOB:</span> {formatDate(superbill.patientDob)}</p>
        <p><span className="font-medium">Date:</span> {formatDate(superbill.issueDate)}</p>
        {earliestDate && latestDate && (
          <p>
            <span className="font-medium">Visit Period:</span> {formatDate(earliestDate)} 
            {" to "} 
            {formatDate(latestDate)}
          </p>
        )}
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Provider Information</h3>
        <p><span className="font-medium">Provider:</span> {superbill.providerName}</p>
        <p>{superbill.clinicName}</p>
        <p>{superbill.clinicAddress}</p>
        <p><span className="font-medium">Phone:</span> {superbill.clinicPhone}</p>
        <p><span className="font-medium">Email:</span> {superbill.clinicEmail}</p>
        <p><span className="font-medium">EIN:</span> {superbill.ein}</p>
        <p><span className="font-medium">NPI #:</span> {superbill.npi}</p>
      </div>
    </div>
  );
}
