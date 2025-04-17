
import { format } from "date-fns";
import { Visit, Superbill } from "@/types/superbill";

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date): string => {
  if (!date) return '';
  return format(new Date(date), "MM/dd/yyyy");
};

/**
 * Formats a currency amount for display
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Calculates the total fee from an array of visits
 */
export const calculateTotalFee = (visits: Visit[]): number => {
  return visits.reduce((sum, visit) => sum + (visit.fee || 0), 0);
};

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
    fee: defaultFee
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

// Common ICD-10 codes for physical therapy, chiropractic, and related fields
export const commonICD10Codes = [
  // Musculoskeletal
  { value: "M54.5", label: "M54.5 - Low back pain" },
  { value: "M54.2", label: "M54.2 - Cervicalgia (Neck pain)" },
  { value: "M25.511", label: "M25.511 - Pain in right shoulder" },
  { value: "M25.512", label: "M25.512 - Pain in left shoulder" },
  { value: "M25.551", label: "M25.551 - Pain in right hip" },
  { value: "M25.552", label: "M25.552 - Pain in left hip" },
  { value: "M25.561", label: "M25.561 - Pain in right knee" },
  { value: "M25.562", label: "M25.562 - Pain in left knee" },
  { value: "M79.1", label: "M79.1 - Myalgia (Muscle pain)" },
  { value: "M79.7", label: "M79.7 - Fibromyalgia" },
  { value: "M54.16", label: "M54.16 - Radiculopathy, lumbar region" },
  { value: "M54.12", label: "M54.12 - Radiculopathy, cervical region" },
  { value: "M50.20", label: "M50.20 - Cervical disc disorder, unspecified" },
  { value: "M51.26", label: "M51.26 - Lumbar disc displacement" },

  // Headaches and neurological
  { value: "G44.209", label: "G44.209 - Tension-type headache" },
  { value: "G43.909", label: "G43.909 - Migraine, unspecified" },
  { value: "G89.29", label: "G89.29 - Other chronic pain" },
  { value: "G56.00", label: "G56.00 - Carpal tunnel syndrome" },
  { value: "M54.81", label: "M54.81 - Occipital neuralgia" },

  // Sprains, strains, and injuries
  { value: "S13.4XXA", label: "S13.4XXA - Sprain of cervical spine, initial encounter" },
  { value: "S33.5XXA", label: "S33.5XXA - Sprain of ligaments of lumbar spine, initial encounter" },
  { value: "S43.401A", label: "S43.401A - Sprain of right shoulder joint, initial encounter" },
  { value: "S43.402A", label: "S43.402A - Sprain of left shoulder joint, initial encounter" },

  // Prenatal
  { value: "O26.9", label: "O26.9 - Pregnancy related condition, unspecified" },
  { value: "O26.891", label: "O26.891 - Other specified pregnancy related conditions" },
  { value: "Z34.00", label: "Z34.00 - Encounter for supervision of normal first pregnancy, unspecified" },
  { value: "Z34.80", label: "Z34.80 - Encounter for supervision of other normal pregnancy, unspecified" },
  { value: "M54.9", label: "M54.9 - Dorsalgia, unspecified (back pain)" },

  // Posture and functional conditions
  { value: "M62.838", label: "M62.838 - Other muscle spasm" },
  { value: "R29.3", label: "R29.3 - Abnormal posture" },
  { value: "M40.00", label: "M40.00 - Postural kyphosis" },
  { value: "M41.9", label: "M41.9 - Scoliosis, unspecified" },

  // Wellness and prevention
  { value: "Z00.00", label: "Z00.00 - General adult medical examination without abnormal findings" },
  { value: "Z71.89", label: "Z71.89 - Other specified counseling" },
];

// Common CPT Codes for physical therapy, chiropractic, and related services
export const commonCPTCodes = [
  // Evaluation and management
  { value: "99201", label: "99201 - Office visit, new patient, level 1" },
  { value: "99202", label: "99202 - Office visit, new patient, level 2" },
  { value: "99203", label: "99203 - Office visit, new patient, level 3" },
  { value: "99211", label: "99211 - Office visit, established patient, level 1" },
  { value: "99212", label: "99212 - Office visit, established patient, level 2" },
  { value: "99213", label: "99213 - Office visit, established patient, level 3" },
  
  // Chiropractic manipulative treatment (CMT)
  { value: "98940", label: "98940 - CMT, spinal, 1-2 regions" },
  { value: "98941", label: "98941 - CMT, spinal, 3-4 regions" },
  { value: "98942", label: "98942 - CMT, spinal, 5 regions" },
  { value: "98943", label: "98943 - CMT, extraspinal, 1+ regions" },
  
  // Physical therapy and therapeutic procedures
  { value: "97010", label: "97010 - Hot/cold packs therapy" },
  { value: "97012", label: "97012 - Mechanical traction therapy" },
  { value: "97014", label: "97014 - Electrical stimulation therapy" },
  { value: "97035", label: "97035 - Ultrasound therapy" },
  { value: "97110", label: "97110 - Therapeutic exercises" },
  { value: "97112", label: "97112 - Neuromuscular reeducation" },
  { value: "97140", label: "97140 - Manual therapy" },
  { value: "97530", label: "97530 - Therapeutic activities" },
  
  // X-rays and imaging
  { value: "72020", label: "72020 - X-ray of spine, single view" },
  { value: "72040", label: "72040 - X-ray of spine, cervical, 2-3 views" },
  { value: "72100", label: "72100 - X-ray of spine, lumbosacral, 2-3 views" },
];
