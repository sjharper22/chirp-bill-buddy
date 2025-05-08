
import { formatDate } from "@/lib/utils/superbill-utils";
import { PatientInfoProps } from "./types";

export function PatientInfo({ patientDob, visitDates, complaints }: PatientInfoProps) {
  const { earliestDate, latestDate } = visitDates;
  
  // Display logic for complaints (showing up to 2, then "and X more")
  const complaintsDisplay = complaints.length > 0 
    ? (complaints.length > 2
        ? `${complaints.slice(0, 2).join(", ")} and ${complaints.length - 2} more`
        : complaints.join(", "))
    : null;
    
  return (
    <div className="text-sm text-muted-foreground mb-4">
      <p>DOB: {formatDate(patientDob)}</p>
      {earliestDate && latestDate && (
        <p>
          Visit Period: {formatDate(earliestDate)} to {formatDate(latestDate)}
        </p>
      )}
      {complaintsDisplay && (
        <p className="mt-1 font-medium text-foreground line-clamp-1">
          Primary Complaints: {complaintsDisplay}
        </p>
      )}
    </div>
  );
}
