
import { Card } from "@/components/ui/card";
import { AIAssistantButton } from "@/components/ai/AIAssistantButton";
import { Superbill } from "@/types/superbill";
import { useState, useEffect, useRef } from "react";
import { generateCoverLetterFromSuperbills } from "@/lib/utils/cover-letter";

interface CoverLetterPreviewProps {
  superbills: Superbill[];
  includeInvoiceNote?: boolean;
  editable?: boolean;
  superbill?: Superbill;
  selectedTemplateId?: string;
  content?: string;
  onContentChange?: (content: string) => void;
}

export function CoverLetterPreview({ 
  superbills = [],
  superbill,
  includeInvoiceNote = true,
  editable = false,
  selectedTemplateId,
  content,
  onContentChange
}: CoverLetterPreviewProps) {
  const [displayContent, setDisplayContent] = useState<string>("");
  const [hasBeenEnhanced, setHasBeenEnhanced] = useState(false);
  const lastContentRef = useRef<string>("");
  const enhancedContentRef = useRef<string>("");
  
  useEffect(() => {
    // If we have enhanced content, always use that first
    if (hasBeenEnhanced && enhancedContentRef.current) {
      console.log("Using preserved enhanced content");
      setDisplayContent(enhancedContentRef.current);
      return;
    }

    // If content is provided from props and it's different, use it
    if (content && content !== lastContentRef.current) {
      console.log("Using provided content for cover letter");
      setDisplayContent(content);
      lastContentRef.current = content;
      return;
    }
    
    // Only generate new content if we don't have any content and haven't been enhanced
    if (!hasBeenEnhanced && !content && !displayContent) {
      const billsToProcess = superbill ? [superbill] : superbills;
      
      if (billsToProcess.length > 0) {
        console.log("Generating cover letter from superbills:", billsToProcess.length);
        console.log("Patients:", billsToProcess.map(b => b.patientName).join(', '));
        const letterContent = generateCoverLetterFromSuperbills(billsToProcess, includeInvoiceNote);
        setDisplayContent(letterContent);
        lastContentRef.current = letterContent;
      }
    }
  }, [superbills, superbill, includeInvoiceNote, selectedTemplateId, content, hasBeenEnhanced]);
  
  const handleAIEnhancement = (enhancedContent: string) => {
    console.log("AI enhancement received, updating content and marking as enhanced");
    setDisplayContent(enhancedContent);
    setHasBeenEnhanced(true);
    enhancedContentRef.current = enhancedContent;
    lastContentRef.current = enhancedContent;
    if (onContentChange) {
      onContentChange(enhancedContent);
    }
  };

  if (!displayContent && superbills.length === 0 && !superbill) {
    return null;
  }

  const billsToProcess = superbill ? [superbill] : superbills;
  const patientInfo = billsToProcess.length > 0 ? {
    patients: billsToProcess.map(b => b.patientName),
    totalVisits: billsToProcess.reduce((sum, b) => sum + b.visits.length, 0),
    clinicName: billsToProcess[0]?.clinicName,
    providerName: billsToProcess[0]?.providerName
  } : undefined;

  return (
    <div className="space-y-4">
      {editable && displayContent && (
        <div className="flex justify-end">
          <AIAssistantButton
            type="cover_letter_enhancement"
            prompt={`Please enhance this insurance cover letter to be more professional, persuasive, and medically accurate while maintaining all important details: ${displayContent}`}
            context={patientInfo}
            onResult={handleAIEnhancement}
            variant="outline"
            size="sm"
          >
            Enhance with AI
          </AIAssistantButton>
        </div>
      )}
      
      <Card className="p-6 border rounded-md shadow-sm mb-8 no-page-break" data-testid="cover-letter-preview">
        <div dangerouslySetInnerHTML={{ __html: displayContent }} />
      </Card>
    </div>
  );
}
