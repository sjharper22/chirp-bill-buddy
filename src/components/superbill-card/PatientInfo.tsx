import { formatDate } from "@/lib/utils/superbill-utils";
import { PatientInfoProps } from "./types";

export function PatientInfo({ 
  patientDob, 
  visitDates, 
  complaints,
  compact 
}: PatientInfoProps) {
  const { earliestDate, latestDate } = visitDates;
  
  // Display logic for complaints (showing up to 2, then "and X more")
  const complaintsDisplay = complaints.length > 0 
    ? (complaints.length > 2
        ? `${complaints.slice(0, 2).join(", ")} and ${complaints.length - 2} more`
        : complaints.join(", "))
    : null;
  
  return (
    <div className={`${compact ? "text-xs" : "text-sm"} text-muted-foreground mb-3`}>
      <p>DOB: {formatDate(patientDob)}</p>
      
      {earliestDate && latestDate && (
        <p className={`${compact ? "hidden sm:block" : ""}`}>
          Period: {formatDate(earliestDate)} - {formatDate(latestDate)}
        </p>
      )}
      
      {complaintsDisplay && (
        <p className={`mt-1 font-medium text-foreground line-clamp-1 ${compact ? "hidden sm:block" : ""}`}>
          Complaints: {complaintsDisplay}
        </p>
      )}
    </div>
  );
}
