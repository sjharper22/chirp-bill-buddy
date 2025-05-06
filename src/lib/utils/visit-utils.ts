
import { Visit } from "@/types/superbill";
import { SuperbillStatus } from "@/types/superbill";

// Create an empty visit with default values
export function createEmptyVisit(): Visit {
  return {
    id: crypto.randomUUID(),
    date: new Date(),
    icdCodes: [],
    cptCodes: [],
    mainComplaints: [],
    fee: 0,
    notes: '',
    status: 'draft'
  };
}

// Duplicate an existing visit
export function duplicateVisit(visit: Visit): Visit {
  return {
    ...visit,
    id: crypto.randomUUID(),
  };
}

// Get the visual variant for a status
export function getStatusVariant(status: SuperbillStatus | string): "default" | "success" | "warning" | "info" | "error" {
  // Normalize the status string
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'in_review':
      return 'info';
    case 'draft':
      return 'default';
    default:
      return 'default';
  }
}

// Convert a status to a display friendly format
export function statusToDisplay(status: SuperbillStatus | string): string {
  switch (status) {
    case 'in_progress': 
      return 'In Progress';
    case 'in_review':
      return 'In Review';
    case 'completed':
      return 'Completed';
    case 'draft':
      return 'Draft';
    default:
      return status;
  }
}
