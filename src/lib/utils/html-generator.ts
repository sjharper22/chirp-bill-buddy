
import { Superbill } from "@/types/superbill";
import { buildDocumentStructure } from "./html-generator/document-builder";

export function generatePrintableHTML(superbill: Superbill, coverLetterContent?: string): string {
  return buildDocumentStructure(superbill, coverLetterContent);
}
