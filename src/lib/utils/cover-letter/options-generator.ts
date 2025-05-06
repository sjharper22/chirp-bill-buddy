
import { Superbill } from "@/types/superbill";
import { formatDate } from "@/lib/utils/format-utils";
import { calculateTotalFee } from "@/lib/utils/financial-utils";
import { CoverLetterOptions, PatientSummary } from "./types";

/**
 * Generates options object from a superbill for cover letter generation
 */
export function generateOptionsFromSuperbill(superbill: Superbill, includeInvoiceNote = true): CoverLetterOptions {
  const totalVisits = superbill.visits.length;
  const totalCharges = calculateTotalFee(superbill.visits);
  
  // Find date range for visits
  const sortedVisits = [...superbill.visits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const earliestDate = sortedVisits.length > 0 ? new Date(sortedVisits[0].date) : new Date();
  const latestDate = sortedVisits.length > 0 
    ? new Date(sortedVisits[sortedVisits.length - 1].date) 
    : new Date();
    
  const visitDateRange = `${formatDate(earliestDate)} - ${formatDate(latestDate)}`;
  
  return {
    patientName: superbill.patientName,
    totalVisits,
    totalCharges,
    visitDateRange,
    providerName: superbill.providerName,
    clinicName: superbill.clinicName,
    clinicAddress: superbill.clinicAddress,
    clinicPhone: superbill.clinicPhone,
    clinicEmail: superbill.clinicEmail,
    ein: superbill.ein,
    npi: superbill.npi,
    includeInvoiceNote
  };
}

/**
 * Groups superbills by patient and calculates summaries for each patient
 */
export function generatePatientSummaries(superbills: Superbill[]): PatientSummary[] {
  // Group superbills by patient name
  const superbillsByPatient: Record<string, Superbill[]> = {};
  
  superbills.forEach(superbill => {
    if (!superbillsByPatient[superbill.patientName]) {
      superbillsByPatient[superbill.patientName] = [];
    }
    superbillsByPatient[superbill.patientName].push(superbill);
  });
  
  // Generate a summary for each patient
  return Object.entries(superbillsByPatient).map(([patientName, patientSuperbills]) => {
    // Calculate patient-specific totals
    const totalVisits = patientSuperbills.reduce((total, sb) => total + sb.visits.length, 0);
    const totalCharges = patientSuperbills.reduce((total, sb) => {
      return total + calculateTotalFee(sb.visits);
    }, 0);
    
    // Determine date range for this patient's visits
    const allVisitDates: Date[] = [];
    patientSuperbills.forEach(sb => {
      sb.visits.forEach(visit => {
        allVisitDates.push(new Date(visit.date));
      });
    });
    
    const earliestDate = allVisitDates.length > 0 
      ? new Date(Math.min(...allVisitDates.map(d => d.getTime()))) 
      : new Date();
    const latestDate = allVisitDates.length > 0 
      ? new Date(Math.max(...allVisitDates.map(d => d.getTime()))) 
      : new Date();
    const visitDateRange = `${formatDate(earliestDate)} - ${formatDate(latestDate)}`;
    
    return {
      patientName,
      visitDates: allVisitDates,
      totalVisits,
      totalCharges,
      visitDateRange
    };
  });
}
