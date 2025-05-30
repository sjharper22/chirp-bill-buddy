
import { Superbill } from "@/types/superbill";
import { buildSeparateDocuments } from "./html-generator/document-builder";

export function generatePrintableHTML(superbill: Superbill, coverLetterContent?: string): { coverLetterHTML: string; superbillHTML: string } {
  return buildSeparateDocuments(superbill, coverLetterContent);
}
