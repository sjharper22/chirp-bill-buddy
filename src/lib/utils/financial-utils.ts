
import { Visit } from "@/types/superbill";

/**
 * Calculates the total fee from an array of visits
 */
export const calculateTotalFee = (visits: Visit[]): number => {
  return visits.reduce((sum, visit) => sum + (visit.fee || 0), 0);
};
