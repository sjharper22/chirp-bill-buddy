
import { jsPDF } from "jspdf";
import { Superbill } from "@/types/superbill";
import { formatDate } from "@/lib/utils/superbill-utils";

export function createPDFDocument(): jsPDF {
  return new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true
  });
}

export function addPDFMetadata(pdf: jsPDF, superbill: Superbill): void {
  pdf.setProperties({
    title: `Superbill - ${superbill.patientName}`,
    subject: 'Healthcare Services Documentation',
    author: superbill.clinicName,
    creator: superbill.clinicName
  });
}

export function generateFileName(superbill: Superbill): string {
  const timestamp = formatDate(superbill.issueDate).replace(/\//g, '-');
  const patientName = superbill.patientName.replace(/[^a-zA-Z0-9]/g, '-');
  return `Superbill-${patientName}-${timestamp}.pdf`;
}
