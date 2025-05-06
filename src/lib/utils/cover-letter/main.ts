
import { Superbill } from "@/types/superbill";
import { generateCoverLetter } from "./single-patient-generator";
import { generateOptionsFromSuperbill } from "./options-generator";
import { generateMultiPatientCoverLetter } from "./multi-patient-generator";

/**
 * Main function that generates a cover letter from superbills.
 * Will use single-patient or multi-patient generator based on input.
 */
export function generateCoverLetterFromSuperbills(
  superbills: Superbill[],
  includeInvoiceNote = true
): string {
  if (superbills.length === 0) {
    return "";
  }

  // For a single superbill, use the single-patient generator
  if (superbills.length === 1) {
    const options = generateOptionsFromSuperbill(superbills[0], includeInvoiceNote);
    return generateCoverLetter(options);
  }
  
  // For multiple superbills, use the multi-patient generator
  return generateMultiPatientCoverLetter(superbills, includeInvoiceNote);
}
