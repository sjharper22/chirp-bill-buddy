
import { formatDate } from "@/lib/utils/superbill-utils";
import { PatientInfoProps } from "./types";

export function PatientInfo({ patientDob, visitDates, complaints, isExpanded }: PatientInfoProps) {
  const { earliestDate, latestDate } = visitDates;
  
  // Format dates properly, handling both string and Date objects
  const formatDateValue = (dateValue: Date | string | null) => {
    if (!dateValue) return null;
    return typeof dateValue === 'string' ? formatDate(new Date(dateValue)) : formatDate(dateValue);
  };

  const formattedDob = formatDateValue(patientDob);
  const formattedEarliestDate = formatDateValue(earliestDate);
  const formattedLatestDate = formatDateValue(latestDate);
  
  // Display logic for complaints (showing up to 2, then "and X more")
  const complaintsDisplay = complaints.length > 0 
    ? (complaints.length > 2
        ? `${complaints.slice(0, 2).join(", ")} and ${complaints.length - 2} more`
        : complaints.join(", "))
    : null;
    
  // Important: We always show the DOB, but the visit period and complaints only when expanded
  return (
    <div className="text-sm text-muted-foreground mb-4">
      <p>DOB: {formattedDob}</p>
      
      {/* The following elements are conditionally rendered based on expansion state */}
      {isExpanded && earliestDate && latestDate && (
        <p className="break-words mt-1">
          <span className="block sm:inline">Visit Period:</span> {formattedEarliestDate} to {formattedLatestDate}
        </p>
      )}
      
      {isExpanded && complaintsDisplay && (
        <p className="font-medium text-foreground break-words mt-1">
          <span className="block sm:inline">Primary Complaints:</span> {complaintsDisplay}
        </p>
      )}
    </div>
  );
}
