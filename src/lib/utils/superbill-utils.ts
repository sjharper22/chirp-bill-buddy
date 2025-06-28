import { Visit } from "@/types/superbill";
import { CptCodeEntry } from "@/types/cpt-entry";

export function formatDate(date: Date | undefined): string {
  if (!date) return "";
  try {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return "$0.00";
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function calculateTotalFee(visits: Visit[]): number {
  return visits.reduce((total, visit) => {
    // Use itemized CPT entries if available, otherwise fall back to visit fee
    if (visit.cptCodeEntries && visit.cptCodeEntries.length > 0) {
      return total + visit.cptCodeEntries.reduce((visitTotal, entry) => visitTotal + entry.fee, 0);
    }
    return total + (visit.fee || 0);
  }, 0);
}

export const commonIcdCodes = [
  { value: "M54.5", label: "Low Back Pain" },
  { value: "M54.2", label: "Cervicalgia" },
  { value: "M54.9", label: "Dorsalgia, unspecified" },
  { value: "M25.561", label: "Pain in right knee" },
  { value: "M79.7", label: "Fibromyalgia" },
  { value: "M25.511", label: "Pain in right shoulder" },
  { value: "M79.601", label: "Pain in right arm" },
  { value: "M79.602", label: "Pain in left arm" },
  { value: "M79.621", label: "Pain in right leg" },
  { value: "M79.622", label: "Pain in left leg" },
  { value: "M79.1", label: "Myalgia" },
  { value: "M54.16", label: "Radiculopathy, lumbar region" },
  { value: "M54.12", label: "Radiculopathy, cervical region" },
  { value: "M47.811", label: "Spondylosis without myelopathy or radiculopathy, cervical region" },
  { value: "M47.812", label: "Spondylosis without myelopathy or radiculopathy, thoracic region" },
  { value: "M47.816", label: "Spondylosis without myelopathy or radiculopathy, lumbar region" },
  { value: "M53.1", label: "Cervicobrachial syndrome" },
  { value: "M53.82", label: "Other specified cervicothoracic conditions" },
  { value: "M53.86", label: "Other specified spondylopathies" },
  { value: "M62.838", label: "Other muscle spasm" },
  { value: "M62.89", label: "Other specified disorders of muscle" },
  { value: "M72.2", label: "Plantar fasciitis" },
  { value: "M77.9", label: "Enthesopathy, unspecified" },
  { value: "M99.01", label: "Segmental and somatic dysfunction of cervical region" },
  { value: "M99.02", label: "Segmental and somatic dysfunction of thoracic region" },
  { value: "M99.03", label: "Segmental and somatic dysfunction of lumbar region" },
  { value: "M99.04", label: "Segmental and somatic dysfunction of sacral region" },
  { value: "M99.05", label: "Segmental and somatic dysfunction of pelvic region" },
  { value: "M99.06", label: "Segmental and somatic dysfunction of lower extremity" },
  { value: "M99.07", label: "Segmental and somatic dysfunction of upper extremity" },
  { value: "M99.08", label: "Segmental and somatic dysfunction of head region" },
  { value: "M99.8", label: "Other specified biomechanical lesions" },
  { value: "M99.9", label: "Biomechanical lesion, unspecified" },
  { value: "S13.4XXA", label: "Sprain of ligaments of cervical spine, initial encounter" },
  { value: "S33.5XXA", label: "Sprain of ligaments of lumbar spine, initial encounter" },
  { value: "Z23", label: "Encounter for immunization" },
  { value: "Z00.00", label: "Encounter for general adult medical examination without abnormal findings" }
];

export const commonCPTCodes = [
  { value: "98940", label: "Chiropractic manipulative treatment (CMT); spinal, 1-2 regions" },
  { value: "98941", label: "Chiropractic manipulative treatment (CMT); spinal, 3-4 regions" },
  { value: "98942", label: "Chiropractic manipulative treatment (CMT); spinal, 5 regions" },
  { value: "98943", label: "Chiropractic manipulative treatment (CMT); extraspinal, 1 or more regions" },
  { value: "97140", label: "Manual therapy techniques (eg, mobilization/ manipulation, manual lymphatic drainage, manual traction), 1 or more regions, each 15 minutes" },
  { value: "97110", label: "Therapeutic procedure, 1 or more areas, each 15 minutes; therapeutic exercises to develop strength and endurance, range of motion and flexibility" },
  { value: "97010", label: "Application of a modality to one or more areas; hot or cold packs" },
  { value: "97014", label: "Application of a modality to one or more areas; electrical stimulation (unattended)" },
  { value: "97035", label: "Application of a modality to one or more areas; ultrasound, each 15 minutes" },
  { value: "97112", label: "Therapeutic procedure, 1 or more areas, each 15 minutes; neuromuscular reeducation of movement, balance, coordination, kinesthetic sense, posture, and/or proprioception for sitting and/or standing activities" },
  { value: "97150", label: "Therapeutic procedure(s), group (2 or more individuals)" },
  { value: "99202", label: "Office or other outpatient visit for the evaluation and management of a new patient" },
  { value: "99203", label: "Office or other outpatient visit for the evaluation and management of a new patient" },
  { value: "99204", label: "Office or other outpatient visit for the evaluation and management of a new patient" },
  { value: "99212", label: "Office or other outpatient visit for the evaluation and management of an established patient" },
  { value: "99213", label: "Office or other outpatient visit for the evaluation and management of an established patient" },
  { value: "99214", label: "Office or other outpatient visit for the evaluation and management of an established patient" },
  { value: "G0283", label: "Electrical stimulation (unattended), Medicare" },
  { value: "97012", label: "Mechanical traction" },
  { value: "97039", label: "Unlisted modality (specify type and time if constant attendance)" },
  { value: "97124", label: "Massage, each 15 minutes" },
  { value: "97151", label: "Therapeutic procedures(s), each 15 minutes; with patient contact; one-on-one" },
  { value: "97530", label: "Therapeutic activities, direct (one-on-one) patient contact by the provider (use of dynamic activities to improve functional performance), each 15 minutes" },
  { value: "98945", label: "Chiropractic manipulative treatment (CMT); spinal and extraspinal, 1 or more regions" },
];
