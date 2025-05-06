import { Superbill, SuperbillStatus } from "@/types/superbill";

// Helper function to determine superbill status
export const determineStatus = (superbills: Superbill[]): "Draft" | "Complete" | "Missing Info" | "No Superbill" => {
  if (superbills.length === 0) return "No Superbill";

  // Check if any of the superbills have an explicit status
  // Always trust the superbill's own status field first
  for (const bill of superbills) {
    switch (bill.status) {
      case 'in_progress':
        return "Missing Info";
      case 'in_review':
        return "Missing Info";
      case 'draft':
        return "Draft";
      case 'completed':
        // Only mark as complete if all superbills are completed
        if (superbills.every(sb => sb.status === 'completed')) {
          return "Complete";
        }
        // Otherwise continue checking
    }
  }
  
  // If no definitive status from superbill status fields,
  // fall back to content-based determination
  
  // Check if all required information is present
  const hasAllInfo = superbills.every(bill => 
    bill.patientName && 
    bill.visits.length > 0 && 
    bill.visits.every(visit => visit.icdCodes.length > 0 && visit.cptCodes.length > 0)
  );
  
  if (hasAllInfo) {
    // Double check if individual visits are all completed
    const allVisitsCompleted = superbills.every(bill =>
      bill.visits.every(visit => !visit.status || visit.status === 'completed')
    );
    
    return allVisitsCompleted ? "Complete" : "Missing Info";
  }
  
  // Check if any visits are missing codes or fees
  const hasMissingInfo = superbills.some(bill => 
    bill.visits.some(visit => 
      visit.icdCodes.length === 0 || 
      visit.cptCodes.length === 0 || 
      visit.fee <= 0
    )
  );
  
  if (hasMissingInfo) return "Missing Info";
  return "Draft";
};
