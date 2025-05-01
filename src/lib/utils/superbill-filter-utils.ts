
import { Superbill } from "@/types/superbill";
import { formatDate } from "./format-utils";

/**
 * Filters superbills based on search term
 * Searches in patient name and formatted date
 */
export const filterSuperbills = (superbills: Superbill[], searchTerm: string): Superbill[] => {
  if (!searchTerm.trim()) {
    return superbills;
  }
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return superbills.filter(superbill => {
    const patientName = superbill.patientName.toLowerCase();
    const dateStr = superbill.issueDate ? formatDate(superbill.issueDate).toLowerCase() : '';
    
    return patientName.includes(lowerCaseSearchTerm) || dateStr.includes(lowerCaseSearchTerm);
  });
};

/**
 * Sorts superbills by date in descending order (newest first)
 */
export const sortSuperbillsByDate = (superbills: Superbill[]): Superbill[] => {
  return [...superbills].sort((a, b) => {
    // Get the dates, defaulting to current date if undefined
    const dateA = a.issueDate ? new Date(a.issueDate).getTime() : Date.now();
    const dateB = b.issueDate ? new Date(b.issueDate).getTime() : Date.now();
    
    // Sort in descending order (newest first)
    return dateB - dateA;
  });
};
