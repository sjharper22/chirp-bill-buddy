
import { Visit } from "@/types/superbill";
import { generateId } from "./id-utils";

/**
 * Creates an empty visit with default values
 */
export const createEmptyVisit = (
  defaultIcdCodes: string[] = [],
  defaultCptCodes: string[] = [],
  defaultFee: number = 0
): Visit => {
  return {
    id: generateId(),
    date: new Date(),
    icdCodes: [...defaultIcdCodes],
    cptCodes: [...defaultCptCodes],
    mainComplaints: [],
    fee: defaultFee,
    status: 'draft' // Default status for new visits
  };
};

/**
 * Duplicates a visit with a new ID
 */
export const duplicateVisit = (visit: Visit): Visit => {
  return {
    ...visit,
    id: generateId()
  };
};

/**
 * Get status variant for styling
 */
export const getStatusVariant = (status?: string): 'default' | 'success' | 'warning' | 'info' | 'error' => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'warning';
    case 'draft': return 'info';
    case 'in_review': return 'info';
    default: return 'default';
  }
};
