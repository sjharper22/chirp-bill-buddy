
import { Card } from "@/components/ui/card";
import { Superbill } from "@/types/superbill";
import { useState, useEffect } from "react";
import { generateCoverLetterFromSuperbills } from "@/lib/utils/cover-letter-generator";

interface CoverLetterPreviewProps {
  superbills: Superbill[];
  includeInvoiceNote?: boolean;
  editable?: boolean;
}

export function CoverLetterPreview({ 
  superbills, 
  includeInvoiceNote = true,
  editable = false
}: CoverLetterPreviewProps) {
  const [content, setContent] = useState<string>("");
  
  useEffect(() => {
    if (superbills.length > 0) {
      const letterContent = generateCoverLetterFromSuperbills(superbills, includeInvoiceNote);
      setContent(letterContent);
    }
  }, [superbills, includeInvoiceNote]);
  
  if (superbills.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 border rounded-md shadow-sm" data-testid="cover-letter-preview">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Card>
  );
}
