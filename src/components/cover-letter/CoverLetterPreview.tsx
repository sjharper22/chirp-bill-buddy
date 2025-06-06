
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
  
  useEffect(() => {
    // If content is provided and it's different from what we had before, use it
    if (content && content !== lastContentRef.current) {
      console.log("Using provided content for cover letter");
      setDisplayContent(content);
      lastContentRef.current = content;
      // If the content is significantly different from generated content, mark as enhanced
      if (hasBeenEnhanced || content.length < 5000) { // Enhanced content is usually shorter
        setHasBeenEnhanced(true);
      }
      return;
    }
    
    // Only generate new content if we don't have enhanced content
    if (!hasBeenEnhanced && !content) {
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
    console.log("AI enhancement received, updating content");
    setDisplayContent(enhancedContent);
    setHasBeenEnhanced(true);
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
