
import { Visit, Superbill } from "@/types/superbill";
import { format } from "date-fns";

// Generate a random ID for new items
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Calculate the total fee for all visits
export function calculateTotalFee(visits: Visit[]): number {
  return visits.reduce((total, visit) => total + (visit.fee || 0), 0);
}

// Format date to MM/DD/YYYY
export function formatDate(date: Date | null): string {
  if (!date) return "";
  return format(date, "MM/dd/yyyy");
}

// Format currency as $X.XX
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount);
}

// Create an empty visit with default values
export function createEmptyVisit(defaultIcdCodes: string[], defaultCptCodes: string[], defaultFee: number): Visit {
  return {
    id: generateId(),
    date: new Date(),
    icdCodes: [...defaultIcdCodes],
    cptCodes: [...defaultCptCodes],
    fee: defaultFee,
    notes: ""
  };
}

// Create a duplicate of a visit
export function duplicateVisit(visit: Visit): Visit {
  return {
    ...visit,
    id: generateId()
  };
}

// Filter superbills by search term (patient name or formatted date)
export function filterSuperbills(superbills: Superbill[], searchTerm: string): Superbill[] {
  if (!searchTerm.trim()) return superbills;
  
  const term = searchTerm.toLowerCase().trim();
  
  return superbills.filter(bill => {
    // Get visit dates if they exist
    const visitDates = bill.visits.map(visit => formatDate(visit.date));
    
    return bill.patientName.toLowerCase().includes(term) ||
           formatDate(bill.issueDate).includes(term) ||
           visitDates.some(date => date.includes(term));
  });
}

// Sort superbills by date (newest first)
export function sortSuperbillsByDate(superbills: Superbill[]): Superbill[] {
  return [...superbills].sort((a, b) => {
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });
}

// Common ICD-10 codes for chiropractic care
export const commonICD10Codes = [
  { value: "M54.5", label: "M54.5 - Low back pain" },
  { value: "M54.2", label: "M54.2 - Cervicalgia (neck pain)" },
  { value: "M54.6", label: "M54.6 - Pain in thoracic spine" },
  { value: "M25.51", label: "M25.51 - Pain in shoulder" },
  { value: "M25.52", label: "M25.52 - Pain in hip" },
  { value: "M25.55", label: "M25.55 - Pain in knee" },
  { value: "M79.1", label: "M79.1 - Myalgia (muscle pain)" },
  { value: "M99.01", label: "M99.01 - Segmental dysfunction of cervical region" },
  { value: "M99.02", label: "M99.02 - Segmental dysfunction of thoracic region" },
  { value: "M99.03", label: "M99.03 - Segmental dysfunction of lumbar region" },
  { value: "M99.05", label: "M99.05 - Segmental dysfunction of pelvic region" },
  { value: "S13.4XXA", label: "S13.4XXA - Sprain of cervical spine" },
  { value: "S23.3XXA", label: "S23.3XXA - Sprain of thoracic spine" },
  { value: "S33.5XXA", label: "S33.5XXA - Sprain of lumbar spine" },
  { value: "G44.209", label: "G44.209 - Tension-type headache" },
  { value: "M50.30", label: "M50.30 - Cervical disc degeneration" },
  { value: "M51.36", label: "M51.36 - Lumbar disc degeneration" },
  { value: "R51", label: "R51 - Headache" }
];

// Common CPT codes for chiropractic care
export const commonCPTCodes = [
  { value: "99202", label: "99202 - New patient, problem-focused exam" },
  { value: "99203", label: "99203 - New patient, detailed exam" },
  { value: "99212", label: "99212 - Established patient, problem-focused exam" },
  { value: "99213", label: "99213 - Established patient, detailed exam" },
  { value: "98940", label: "98940 - Chiropractic manipulation, 1-2 regions" },
  { value: "98941", label: "98941 - Chiropractic manipulation, 3-4 regions" },
  { value: "98942", label: "98942 - Chiropractic manipulation, 5+ regions" },
  { value: "97012", label: "97012 - Mechanical traction" },
  { value: "97014", label: "97014 - Electrical stimulation" },
  { value: "97110", label: "97110 - Therapeutic exercises" },
  { value: "97112", label: "97112 - Neuromuscular reeducation" },
  { value: "97124", label: "97124 - Massage therapy" },
  { value: "97140", label: "97140 - Manual therapy techniques" },
  { value: "97530", label: "97530 - Therapeutic activities" },
  { value: "99354", label: "99354 - Prolonged service, office" }
];
