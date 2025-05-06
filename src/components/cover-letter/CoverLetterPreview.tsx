
import { Card } from "@/components/ui/card";
import { Superbill } from "@/types/superbill";
import { useState, useEffect } from "react";
import { generateCoverLetterFromSuperbills } from "@/lib/utils/cover-letter-generator";

interface CoverLetterPreviewProps {
  superbills: Superbill[];
  includeInvoiceNote?: boolean;
  editable?: boolean;
  superbill?: Superbill; // Added to support single superbill use case
  selectedTemplateId?: string;
}

export function CoverLetterPreview({ 
  superbills = [], // Default to empty array
  superbill, // Single superbill support
  includeInvoiceNote = true,
  editable = false,
  selectedTemplateId
}: CoverLetterPreviewProps) {
  const [content, setContent] = useState<string>("");
  
  useEffect(() => {
    // If a single superbill is provided, use that; otherwise use the array
    const billsToProcess = superbill ? [superbill] : superbills;
    
    if (billsToProcess.length > 0) {
      const letterContent = generateCoverLetterFromSuperbills(billsToProcess, includeInvoiceNote);
      setContent(letterContent);
    }
  }, [superbills, superbill, includeInvoiceNote, selectedTemplateId]);
  
  // Don't render if we have neither superbills nor a superbill
  if ((superbills.length === 0) && !superbill) {
    return null;
  }

  return (
    <Card className="p-6 border rounded-md shadow-sm" data-testid="cover-letter-preview">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Card>
  );
}
