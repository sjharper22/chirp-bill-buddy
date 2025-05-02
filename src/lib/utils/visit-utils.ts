
import { Visit, SuperbillStatus } from "@/types/superbill";
import { generateId } from "./id-utils";
import { StatusDisplayType } from "@/components/group-submission/table/StatusBadge";

export const createEmptyVisit = (): Visit => {
  return {
    id: generateId(),
    date: new Date(),
    icdCodes: [],
    cptCodes: [],
    fee: 0,
    mainComplaints: [],
    status: 'draft' // Set default status
  };
};

export const duplicateVisit = (visit: Visit): Visit => {
  return {
    ...visit,
    id: generateId(),
    status: 'draft' // Reset status for duplicated visits
  };
};

export const getStatusVariant = (status: SuperbillStatus | StatusDisplayType | string): "default" | "success" | "warning" | "info" | "error" => {
  // Normalize the status by converting to lowercase for comparison
  const normalizedStatus = status.toLowerCase();
  
  // Check for status patterns
  if (normalizedStatus.includes('complet') || normalizedStatus === 'complete') {
    return "success";
  } else if (normalizedStatus.includes('progress') || normalizedStatus.includes('review') || normalizedStatus === 'missing info') {
    return "warning";
  } else if (normalizedStatus.includes('draft')) {
    return "info";
  } else if (normalizedStatus.includes('no')) {
    return "error";
  }
  
  // Default fallback for explicit status values
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
    case "in_review":
      return "warning";
    case "draft":
      return "info";
    default:
      return "default";
  }
};

// Function to determine the combined status of visits
export const determineVisitsStatus = (visits: Visit[]): 'draft' | 'in_progress' | 'completed' => {
  if (!visits || visits.length === 0) return 'draft';
  
  // Count visits by status
  const statusCounts = {
    draft: 0,
    in_progress: 0,
    completed: 0
  };
  
  visits.forEach(visit => {
    const status = visit.status || 'draft';
    statusCounts[status]++;
  });
  
  // If any visit is still draft, consider the collection as draft
  if (statusCounts.draft > 0) return 'draft';
  
  // If any visit is in progress, consider the collection as in progress
  if (statusCounts.in_progress > 0) return 'in_progress';
  
  // All visits must be completed
  return 'completed';
};
